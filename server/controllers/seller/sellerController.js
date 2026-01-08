import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import slugify from "slugify";
import {
  uploadToCloudinary,
  resolveBrand,
  deleteFromCloudinary,
} from "../../utils/productService.js"; // Import từ file trên

// ✅ Lấy danh sách sản phẩm của Seller
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({
      sellerId,
      isDeleted: false, // 🛠️ Chỉ lấy sản phẩm chưa bị xóa
    })
      .populate("brand", "name logo")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
    });
  } catch (err) {
    console.error("❌ Lỗi lấy sản phẩm:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Thêm sản phẩm mới
export const addSellerProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;
    // Map các trường từ FormData (snake_case hoặc camelCase đều nhận)
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      brandName,
      stock,
      attributes,
      tags,
      shortDescription,
    } = req.body;

    // 1. Validate
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin bắt buộc: Tên, Giá, Danh mục" });
    }

    // Check Danh mục
    const catExists = await Category.findById(category);
    if (!catExists)
      return res.status(400).json({ message: "Danh mục không hợp lệ" });

    // Check/Tạo Brand
    const finalBrandId = await resolveBrand(brand, brandName);
    if (!finalBrandId)
      return res.status(400).json({ message: "Thương hiệu không hợp lệ" });

    // 2. Upload Ảnh
    let images = [];
    if (req.files?.images) {
      for (const file of req.files.images) {
        const result = await uploadToCloudinary(
          file.buffer,
          "products",
          "image"
        );
        if (result) images.push(result);
      }
    }

    // Xử lý Thumbnail (Lấy ảnh đầu tiên hoặc rỗng)
    const thumbnail = images.length > 0 ? images[0] : {};

    // 3. Upload Video (Lấy video đầu tiên nếu có)
    let video = {};
    if (req.files?.videos && req.files.videos.length > 0) {
      const result = await uploadToCloudinary(
        req.files.videos[0].buffer,
        "products/videos",
        "video"
      );
      if (result) video = result;
    }

    // 4. Tạo Slug
    const slug =
      slugify(name, { lower: true, strict: true }) + "-" + Date.now();

    // 5. Tạo Product (Chuẩn Model mới)
    const newProduct = new Product({
      name,
      slug,
      description: description || "",
      shortDescription: shortDescription || "", // Model mới

      category,
      brand: finalBrandId,
      sellerId,

      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price), // Model mới (CamelCase)
      stock: Number(stock) || 0,
      sold: 0,

      thumbnail, // Model mới lưu Object {url, public_id} hoặc String (đã handle ở controller khác)
      images,
      video, // Model mới lưu Object

      // Parse JSON nếu attributes gửi dạng string từ FormData
      attributes: attributes
        ? typeof attributes === "string"
          ? JSON.parse(attributes)
          : attributes
        : {},
      tags: tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : [],

      isActive: true,
      isDeleted: false,
      status: "pending", // Mặc định chờ duyệt khi tạo mới
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công (Đang chờ duyệt)",
      data: newProduct,
    });
  } catch (err) {
    console.error("❌ Lỗi thêm sản phẩm:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Cập nhật sản phẩm
export const updateSellerProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;
    const updateData = { ...req.body };

    // 1. Check quyền sở hữu & Tồn tại
    const product = await Product.findOne({
      _id: id,
      sellerId,
      isDeleted: false,
    });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // 2. Xử lý Slug (nếu đổi tên)
    if (updateData.name && updateData.name !== product.name) {
      updateData.slug =
        slugify(updateData.name, { lower: true, strict: true }) +
        "-" +
        Date.now();
    }

    // 3. Upload thêm ảnh
    if (req.files?.images) {
      const newImages = [];
      for (const file of req.files.images) {
        const result = await uploadToCloudinary(
          file.buffer,
          "products",
          "image"
        );
        if (result) newImages.push(result);
      }
      // Gộp ảnh cũ + ảnh mới
      updateData.images = [...product.images, ...newImages];

      // Nếu chưa có thumbnail, lấy ảnh đầu tiên làm thumbnail
      if (
        (!product.thumbnail || !product.thumbnail.url) &&
        updateData.images.length > 0
      ) {
        updateData.thumbnail = updateData.images[0];
      }
    }

    // 4. Xử lý field JSON
    if (updateData.attributes && typeof updateData.attributes === "string") {
      updateData.attributes = JSON.parse(updateData.attributes);
    }

    // Mapping lại các field CamelCase nếu FE gửi Snake_case
    if (updateData.original_price)
      updateData.originalPrice = updateData.original_price;
    if (updateData.short_description)
      updateData.shortDescription = updateData.short_description;

    // Reset status về pending nếu sửa nội dung quan trọng (để admin duyệt lại)
    updateData.status = "pending";

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Cập nhật thành công",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Xóa sản phẩm (Soft Delete)
// Thay vì xóa hẳn, ta chỉ ẩn nó đi để giữ lịch sử đơn hàng
export const deleteSellerProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;

    // Tìm và update cờ isDeleted
    const product = await Product.findOneAndUpdate(
      { _id: id, sellerId },
      {
        isDeleted: true,
        isActive: false,
        status: "hidden",
      },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại hoặc không thuộc về bạn" });
    }

    // [Option] Có thể xóa ảnh trên Cloudinary ở đây nếu muốn tiết kiệm dung lượng
    // Nhưng với Soft Delete, thường ta giữ ảnh lại phòng khi khôi phục.

    console.log(`🗑️ Soft Deleted Product: ${product.name}`);

    res.json({
      success: true,
      message: "Đã xóa sản phẩm thành công",
      id: product._id,
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Lấy chi tiết sản phẩm
export const getSellerProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;

    const product = await Product.findOne({
      _id: id,
      sellerId,
      isDeleted: false,
    });

    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
