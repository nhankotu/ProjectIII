import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import FlashSale from "../../models/FlashSale.js";
/* =========================================================
   HELPER: Chuẩn hóa ảnh thumbnail
   ========================================================= */
const formatProductImage = (product) => {
  let thumbUrl = "https://via.placeholder.com/300";

  // Ưu tiên thumbnail object { url, public_id }
  if (product.thumbnail?.url) {
    thumbUrl = product.thumbnail.url;
  }
  // Fallback nếu dữ liệu cũ là string
  else if (typeof product.thumbnail === "string" && product.thumbnail) {
    thumbUrl = product.thumbnail;
  }
  // Fallback lấy ảnh đầu tiên trong mảng images
  else if (product.images?.length > 0) {
    thumbUrl = product.images[0].url || product.images[0];
  }

  return thumbUrl;
};

/* =========================================================
   GET PRODUCTS (Bộ lọc + Phân trang + Sort)
   ========================================================= */
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    /* ---------- 1. FILTER CƠ BẢN (Giữ nguyên) ---------- */
    const filter = { status: "active" };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.seller) filter.sellerId = req.query.seller;

    // ... (Logic lọc Category Slug và Search giữ nguyên) ...
    const searchQuery = req.query.search || req.query.keyword || req.query.q;
    if (searchQuery) {
      const searchRegex = { $regex: searchQuery, $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { tags: searchRegex },
        { slug: searchRegex },
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    /* ---------- 2. SORT (Giữ nguyên) ---------- */
    let sortOption = { createdAt: -1 };
    // ... (Switch case sort giữ nguyên) ...

    /* ---------- 3. QUERY DATABASE ---------- */
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select("-description -specifications");

    const total = await Product.countDocuments(filter);

    /* ---------- 4. 🔥 LOGIC MỚI: KIỂM TRA FLASH SALE ĐANG CHẠY ---------- */
    const now = new Date();
    // Lấy tất cả chiến dịch đang active và trong khung giờ một lần duy nhất
    const activeFlashSales = await FlashSale.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    });

    /* ---------- 5. FORMAT RESPONSE & MERGE SALE DATA ---------- */
    const formattedProducts = products.map((p) => {
      let pObj = p.toObject();

      // Sử dụng helper format ảnh của bạn
      pObj.thumbnail = formatProductImage(p);

      // Mặc định là không có sale
      pObj.isFlashSale = false;

      // Duyệt qua các chiến dịch đang chạy để tìm xem sản phẩm này có được sale không
      for (const sale of activeFlashSales) {
        const saleInfo = sale.products.find(
          (item) =>
            item.product.toString() === p._id.toString() &&
            item.status === "approved",
        );

        if (saleInfo) {
          pObj.isFlashSale = true;
          pObj.salePrice = saleInfo.salePrice;
          pObj.limitQuantity = saleInfo.limitQuantity;
          pObj.soldQuantity = saleInfo.soldQuantity;
          break; // Tìm thấy rồi thì dừng vòng lặp sale này
        }
      }

      return pObj;
    });

    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page,
        limit,
        totalProducts: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ getProducts error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/* =========================================================
   GET PRODUCT BY ID (Chi tiết sản phẩm)
   ========================================================= */
export const getProductById = async (req, res) => {
  try {
    // 1. Lấy thông tin sản phẩm gốc
    const product = await Product.findOne({
      _id: req.params.id,
      status: "active", // Chỉ lấy sản phẩm đang hoạt động
    })
      .populate("category", "name slug image")
      .populate("brand", "name slug logo")
      .populate("sellerId", "name avatar responseRate");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại hoặc đã bị ẩn",
      });
    }

    // Chuyển sang object thuần để tùy chỉnh dữ liệu trả về
    const productData = product.toObject();

    // Chuẩn hóa thumbnail bằng helper bạn đã viết (formatProductImage)
    productData.thumbnail = formatProductImage(product);

    // 2. 🔥 LOGIC KIỂM TRA FLASH SALE ĐANG DIỄN RA
    const now = new Date();

    // Tìm chiến dịch Flash Sale đang chạy (isActive: true) và chứa sản phẩm này
    const activeCampaign = await FlashSale.findOne({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
      "products.product": product._id, // Khớp với trường 'product' trong mảng products
    });

    if (activeCampaign) {
      // Tìm thông tin sale cụ thể của sản phẩm này
      // Phải thỏa mãn: đúng ID sản phẩm VÀ trạng thái sale phải là 'approved'
      const saleInfo = activeCampaign.products.find(
        (item) =>
          item.product.toString() === product._id.toString() &&
          item.status === "approved",
      );

      if (saleInfo) {
        productData.isFlashSale = true;
        productData.salePrice = saleInfo.salePrice; // Gán giá khuyến mãi

        // Trả thêm thông tin để Frontend làm đồng hồ đếm ngược hoặc thanh tiến độ
        productData.flashSaleInfo = {
          flashSaleId: activeCampaign._id,
          endTime: activeCampaign.endTime,
          soldQuantity: saleInfo.soldQuantity,
          limitQuantity: saleInfo.limitQuantity,
        };
      }
    }

    // 3. Đảm bảo cấu trúc video (nếu có)
    productData.video = product.video?.url ? product.video : null;

    res.json({
      success: true,
      data: productData,
    });
  } catch (error) {
    console.error("❌ getProductById Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
/* =========================================================
   FEATURED PRODUCTS (Sản phẩm nổi bật: Rating cao)
   ========================================================= */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active", // ✅ Fix
      ratingAverage: { $gte: 4 },
    })
      .sort({ ratingAverage: -1, sold: -1 }) // Ưu tiên rating cao, sau đó đến bán chạy
      .limit(8)
      .select(
        "name price originalPrice thumbnail slug sold stock ratingAverage",
      );

    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      thumbnail: formatProductImage(p),
    }));

    res.json({ success: true, data: formattedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   HOT PRODUCTS (Bán chạy nhất)
   ========================================================= */
export const getHotProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active", // ✅ Fix
    })
      .sort({ sold: -1 }) // Sắp xếp theo số lượng bán giảm dần
      .limit(10)
      .select(
        "name price originalPrice thumbnail slug sold stock ratingAverage",
      );

    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      thumbnail: formatProductImage(p),
    }));

    res.json({ success: true, data: formattedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET PRODUCTS BY CATEGORY SLUG (Trang chi tiết danh mục)
   ========================================================= */
export const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // 1. Tìm danh mục Cha
    const category = await Category.findOne({ slug, isActive: true });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Danh mục không tồn tại" });
    }

    // 2. 🔥 Tìm tất cả danh mục Con của nó
    // Để khi vào "Thời trang", hiện cả "Áo", "Quần"
    const childCats = await Category.find({ parentId: category._id }).select(
      "_id",
    );

    // Gom ID Cha và các ID Con lại
    const listCategoryIds = [category._id, ...childCats.map((c) => c._id)];

    // 3. Tạo Filter
    const filter = {
      category: { $in: listCategoryIds }, // Tìm sản phẩm thuộc Cha HOẶC Con
      status: "active", // ✅ Fix
    };

    // Filter giá (nếu có)
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // 4. Query
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-description");

    const total = await Product.countDocuments(filter);

    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      thumbnail: formatProductImage(p),
    }));

    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page,
        limit,
        totalProducts: total,
        totalPages: Math.ceil(total / limit),
      },
      // Trả thêm thông tin Category hiện tại để FE hiển thị banner/tiêu đề
      categoryInfo: {
        name: category.name,
        description: category.description,
        image: category.image,
      },
    });
  } catch (error) {
    console.error("❌ getProductsByCategory error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
