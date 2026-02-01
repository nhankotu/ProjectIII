import Product from "../../models/Product.js";
import mongoose from "mongoose";
import Category from "../../models/Category.js";
import slugify from "slugify";
import Brand from "../../models/Brand.js";
import {
  uploadToCloudinary,
  resolveBrand,
  deleteFromCloudinary,
} from "../../utils/productService.js";

// --- Helper: Parse JSON an toàn từ FormData ---
const parseJSON = (data) => {
  try {
    if (typeof data === "string") return JSON.parse(data);
    return data;
  } catch (error) {
    return []; // hoặc {} tùy ngữ cảnh, nhưng ở đây return nguyên bản nếu lỗi
  }
};

// --- HELPER: Validate Variants ---
const validateProductLogic = (type, variants) => {
  if (type === "variable") {
    if (!variants || variants.length === 0) {
      throw new Error(
        "Sản phẩm biến thể bắt buộc phải có danh sách biến thể (SKU).",
      );
    }
    // Check sơ bộ cấu trúc variant
    const isValid = variants.every((v) => v.sku && v.price >= 0);
    if (!isValid)
      throw new Error("Dữ liệu biến thể không hợp lệ (Thiếu SKU hoặc Giá).");
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);

    const products = await Product.find({
      sellerId: sellerId,
      status: { $ne: "deleted" },
    })
      .populate("brand", "name logo")
      .populate("category", "name")
      .select("-description")
      .sort({ createdAt: -1 })
      .lean();

    const formattedProducts = products.map((product) => {
      let displayStock = product.stock || 0;
      let displayPrice = product.price || 0;

      if (product.type === "variable" && Array.isArray(product.variants)) {
        displayStock = product.variants.reduce(
          (sum, variant) => sum + (variant.stock || 0),
          0,
        );

        if (product.variants.length > 0) {
          const prices = product.variants.map((v) => Number(v.price));
          displayPrice = Math.min(...prices);
        }
      }

      // --- LOGIC XỬ LÝ ẢNH THÔNG MINH ---
      let finalThumbnail = null;
      if (typeof product.thumbnail === "string") {
        finalThumbnail = { url: product.thumbnail }; // Convert string về object để đồng bộ format
      } else if (product.thumbnail?.url) {
        finalThumbnail = product.thumbnail;
      } else if (product.images?.[0]?.url) {
        finalThumbnail = product.images[0];
      }

      return {
        ...product,
        id: product._id,
        stock: displayStock,
        price: displayPrice,
        sales: product.sold || 0,
        thumbnail: finalThumbnail, // Trả về dạng Object { url: ... } để Frontend dễ dùng
      };
    });

    res.json({
      success: true,
      message: `Tìm thấy ${formattedProducts.length} sản phẩm`,
      data: formattedProducts,
    });
  } catch (err) {
    console.error("❌ Lỗi lấy sản phẩm Inventory:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================================================
// 1. ADD PRODUCT (Thêm sản phẩm mới)
// =========================================================
export const addSellerProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const body = req.body;
    console.log(body);
    // 1. Validate dữ liệu thô
    if (!body.name || !body.price || !body.category) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập Tên, Giá và Danh mục" });
    }

    // 2. Parse các field JSON
    const shipping = parseJSON(body.shipping);
    const specifications = parseJSON(body.specifications) || [];
    const variants = parseJSON(body.variants) || [];
    const variantAttributes = parseJSON(body.variantAttributes) || [];
    const tags = parseJSON(body.tags) || [];

    // Validate Logic Sản phẩm
    const type = body.type || "simple";
    validateProductLogic(type, variants);

    // Validate Category
    const catExists = await Category.findById(body.category);
    if (!catExists)
      return res.status(400).json({ message: "Danh mục không tồn tại" });

    // 3. Xử lý Brand (Resolve ID hoặc tạo mới nếu logic cho phép)
    let brandId = null;
    const inputBrand = body.brand ? body.brand.trim() : "";

    // A. Nếu người dùng chọn từ Dropdown (Gửi lên ID)
    if (inputBrand && mongoose.Types.ObjectId.isValid(inputBrand)) {
      const existingBrand = await Brand.findById(inputBrand);
      if (existingBrand) {
        brandId = existingBrand._id;
      }
    }

    // B. Nếu người dùng nhập tên mới
    if (!brandId && inputBrand) {
      const existingBrandByName = await Brand.findOne({
        name: { $regex: new RegExp("^" + inputBrand + "$", "i") },
      });

      if (existingBrandByName) {
        brandId = existingBrandByName._id;
      } else {
        const simpleSlug = slugify(inputBrand, {
          lower: true,
          strict: true,
          locale: "vi",
          trim: true,
        });

        const newBrand = await Brand.create({
          name: inputBrand,
          slug: simpleSlug,
          description: "Thương hiệu được tạo tự động",
          logo: "https://placehold.co/200x200/png?text=" + inputBrand,
          productCount: 0,
          isActive: true,
        });

        brandId = newBrand._id;
      }
    }
    if (!brandId) {
      let noBrand = await Brand.findOne({ name: "No Brand" });
      if (!noBrand) {
        noBrand = await Brand.create({
          name: "No Brand",
          slug: "no-brand",
          logo: "https://placehold.co/200x200/png?text=NoBrand",
          description: "Thương hiệu mặc định",
          productCount: 0,
          isActive: true,
        });
      }
      brandId = noBrand._id;
    }
    // 4. Xử lý Upload Ảnh (Files)
    let images = [];
    if (req.files?.images) {
      const uploadPromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer, "products", "image"),
      );
      const results = await Promise.all(uploadPromises);
      images = results.filter((img) => img !== null);
    }

    // Xử lý Thumbnail (Nếu user không chọn, lấy ảnh đầu tiên)
    let thumbnail = images.length > 0 ? images[0] : null;

    // Xử lý Video (Nếu có)
    let video = null;
    if (req.files?.videos && req.files.videos.length > 0) {
      video = await uploadToCloudinary(
        req.files.videos[0].buffer,
        "products/videos",
        "video",
      );
    }

    // 5. TÍNH TOÁN GIÁ GỐC (ROOT PRICE)
    // Nếu là variable, lấy giá thấp nhất của biến thể làm giá hiển thị
    let rootPrice = Number(body.price) || 0;
    let rootStock = Number(body.stock) || 0;

    if (type === "variable" && variants.length > 0) {
      const prices = variants.map((v) => Number(v.price));
      rootPrice = Math.min(...prices); // Lấy giá min
      rootStock = 0; // Stock root của variable thường là 0 hoặc tổng (tùy logic)
    }
    // 6. Tạo Object
    const newProduct = new Product({
      sellerId,
      name: body.name,
      description: body.description || "",
      category: body.category,
      brand: brandId,
      type,

      price: rootPrice,
      originalPrice: Number(body.originalPrice) || rootPrice,
      stock: rootStock,

      shipping: shipping || { weight: 500, height: 10, length: 10, width: 10 },
      specifications,
      variants,
      variantAttributes,
      tags,
      images,
      thumbnail: images.length > 0 ? images[0] : null,
      video,
      status: "pending", //pending neu muon admin duyet san pham
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: newProduct,
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================
// 2. UPDATE PRODUCT (Cập nhật sản phẩm)
// =========================================================
export const updateSellerProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;
    const body = req.body;

    // 1. Tìm sản phẩm
    const product = await Product.findOne({
      _id: id,
      sellerId,
      status: { $ne: "deleted" },
    });
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    // 2. Cập nhật thông tin cơ bản
    if (body.name) product.name = body.name;
    if (body.description) product.description = body.description;
    if (body.category) product.category = body.category;
    if (body.originalPrice) product.originalPrice = Number(body.originalPrice);

    // 3. XỬ LÝ BRAND (Copy logic từ Add sang để đồng bộ)
    if (body.brand) {
      let brandId = null;
      const inputBrand = body.brand.trim();

      if (mongoose.Types.ObjectId.isValid(inputBrand)) {
        const existingBrand = await Brand.findById(inputBrand);
        if (existingBrand) brandId = existingBrand._id;
      }

      if (!brandId) {
        const existingBrandByName = await Brand.findOne({
          name: { $regex: new RegExp("^" + inputBrand + "$", "i") },
        });
        if (existingBrandByName) {
          brandId = existingBrandByName._id;
        } else {
          const simpleSlug = slugify(inputBrand, {
            lower: true,
            strict: true,
            locale: "vi",
          });
          const newBrand = await Brand.create({
            name: inputBrand,
            slug: simpleSlug,
            description: "Auto-created by Seller",
            logo: "https://placehold.co/200x200/png?text=" + inputBrand,
            productCount: 0,
            isActive: true,
          });
          brandId = newBrand._id;
        }
      }
      if (brandId) product.brand = brandId;
    }

    // 4. Xử lý Variants & Price
    if (body.type) product.type = body.type;

    // Parse lại vì gửi qua FormData
    const inputVariants = parseJSON(body.variants);
    const inputAttributes = parseJSON(body.variantAttributes);

    if (product.type === "variable") {
      // Cập nhật variants
      if (inputVariants) product.variants = inputVariants;
      if (inputAttributes) product.variantAttributes = inputAttributes;

      // Tự động cập nhật lại Root Price dựa trên variants mới
      if (product.variants && product.variants.length > 0) {
        const prices = product.variants.map((v) => Number(v.price));
        product.price = Math.min(...prices);
      }
      product.stock = 0;
    } else {
      // Simple product
      product.variants = [];
      product.variantAttributes = [];
      if (body.price) product.price = Number(body.price);
      if (body.stock) product.stock = Number(body.stock);
    }

    // 5. Cập nhật Shipping & Specs
    if (body.shipping) product.shipping = parseJSON(body.shipping);
    if (body.specifications)
      product.specifications = parseJSON(body.specifications);

    // 6. XỬ LÝ ẢNH (Xóa ảnh cũ & Thêm ảnh mới)
    const deletedImageIds = parseJSON(body.deletedImages) || [];

    // A. Xóa ảnh
    if (deletedImageIds.length > 0) {
      product.images = product.images.filter(
        (img) => !deletedImageIds.includes(img.public_id),
      );
      // Xóa trên Cloudinary (Không cần await để response nhanh)
      deletedImageIds.forEach((id) => deleteFromCloudinary(id));
    }

    // B. Thêm ảnh mới
    if (req.files?.images) {
      const uploadPromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer, "products", "image"),
      );
      const newImages = await Promise.all(uploadPromises);
      product.images = [
        ...product.images,
        ...newImages.filter((i) => i !== null),
      ];
    }

    // C. Xử lý Thumbnail (Quan trọng: Nếu thumbnail bị xóa, lấy cái đầu tiên làm thumbnail mới)
    const currentThumbId = product.thumbnail?.public_id;
    // Kiểm tra xem thumbnail hiện tại có nằm trong danh sách bị xóa không, hoặc product chưa có thumbnail
    if (
      !product.thumbnail ||
      (currentThumbId && deletedImageIds.includes(currentThumbId))
    ) {
      if (product.images.length > 0) {
        product.thumbnail = product.images[0]; // Lấy ảnh đầu tiên làm thumb
      } else {
        product.thumbnail = null;
      }
    } else if (product.images.length > 0 && !product.thumbnail) {
      // Trường hợp thêm mới ảnh vào sp chưa có ảnh
      product.thumbnail = product.images[0];
    }

    await product.save();

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error("❌ Update Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// =========================================================
// 3. DELETE PRODUCT (Xóa mềm - Soft Delete)
// =========================================================
export const deleteSellerProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;

    const product = await Product.findOneAndUpdate(
      { _id: id, sellerId },
      {
        status: "deleted",
      },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại hoặc không thuộc quyền sở hữu",
      });
    }

    res.json({
      success: true,
      message: "Đã chuyển sản phẩm vào thùng rác",
      id: product._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================
// 4. GET PRODUCT DETAIL (Cho Seller xem chi tiết để Edit)
// =========================================================
export const getSellerProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;

    const product = await Product.findOne({
      _id: id,
      sellerId,
      status: { $ne: "deleted" },
    })
      // Populate thêm _id để Frontend dễ bind vào Select Option
      .populate("category", "name _id")
      .populate("brand", "name _id logo");

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
