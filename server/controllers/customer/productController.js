import Product from "../../models/Product.js";
import Category from "../../models/Category.js";

/* =========================================================
   HELPER: Chuẩn hóa ảnh thumbnail
   ========================================================= */
const formatProductImage = (product) => {
  let thumbUrl = "https://via.placeholder.com/300";

  if (product.thumbnail?.url) {
    thumbUrl = product.thumbnail.url;
  } else if (typeof product.thumbnail === "string" && product.thumbnail) {
    thumbUrl = product.thumbnail;
  } else if (product.images?.length > 0) {
    thumbUrl = product.images[0].url;
  }

  return thumbUrl;
};

/* =========================================================
   GET PRODUCTS ( Sort + Filter theo Shop)
   ========================================================= */
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    /* ---------- 1. FILTER CƠ BẢN ---------- */
    const filter = {
      isActive: true,
      isDeleted: false,
      status: "active",
    };

    // Filter: Category ID
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filter: Brand
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    // 🔥 Filter: Seller (QUAN TRỌNG CHO SHOP PAGE)
    if (req.query.seller) {
      filter.sellerId = req.query.seller; // Lọc sản phẩm của đúng Shop này
    }

    // Filter: Category Slug
    if (req.query.categorySlug) {
      const category = await Category.findOne({
        slug: req.query.categorySlug,
        isActive: true,
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Danh mục không tồn tại",
        });
      }
      filter.category = category._id;
    }

    // Filter: Search
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    // Filter: Price Range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    /* ---------- 2. XỬ LÝ SẮP XẾP (SORT) ---------- */
    let sortOption = { createdAt: -1 }; // Mặc định: Mới nhất

    if (req.query.sort) {
      switch (req.query.sort) {
        case "price_asc": // Giá thấp -> cao
          sortOption = { price: 1 };
          break;
        case "price_desc": // Giá cao -> thấp
          sortOption = { price: -1 };
          break;
        case "sold_desc": // Bán chạy nhất
          sortOption = { sold: -1 };
          break;
        case "rating_desc": // Đánh giá cao nhất
          sortOption = { ratingAverage: -1 };
          break;
        case "name_asc": // Tên A-Z
          sortOption = { name: 1 };
          break;
        case "newest": // Mới nhất
        default:
          sortOption = { createdAt: -1 };
      }
    }

    /* ---------- 3. QUERY DATABASE ---------- */
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .sort(sortOption) // 🔥 ÁP DỤNG BIẾN SORT DỘNG TẠI ĐÂY
      .skip(skip)
      .limit(limit)
      .select("-description -shortDescription"); // Bỏ bớt field nặng

    const total = await Product.countDocuments(filter);

    /* ---------- 4. FORMAT RESPONSE ---------- */
    // Helper function formatProductImage (Giả sử bạn đã có ở đầu file)
    // Nếu chưa có thì dùng logic đơn giản bên dưới
    const formattedProducts = products.map((p) => {
      let thumbUrl = "https://via.placeholder.com/300";
      if (p.thumbnail?.url) thumbUrl = p.thumbnail.url;
      else if (typeof p.thumbnail === "string") thumbUrl = p.thumbnail;

      return {
        ...p.toObject(),
        thumbnail: thumbUrl,
      };
    });

    res.json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
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
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

/* =========================================================
   GET PRODUCT BY ID
   ========================================================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
      isDeleted: false,
      status: "active",
    })
      .populate("category", "name slug image")
      .populate("brand", "name slug logo")
      .populate("sellerId", "username avatar");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại hoặc đã bị ẩn",
      });
    }

    const productData = product.toObject();

    productData.thumbnail = formatProductImage(product);

    productData.video =
      product.video && product.video.url ? product.video : null;

    res.json({
      success: true,
      data: productData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   FEATURED PRODUCTS
   ========================================================= */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isDeleted: false,
      status: "active",
      ratingAverage: { $gte: 4 },
    })
      .sort({ ratingAverage: -1, sold: -1 })
      .limit(8)
      .select(
        "name price originalPrice thumbnail slug sold stock ratingAverage"
      );

    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      thumbnail: formatProductImage(p),
    }));

    res.json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   HOT PRODUCTS
   ========================================================= */
export const getHotProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isDeleted: false,
      status: "active",
    })
      .sort({ sold: -1 })
      .limit(10)
      .select(
        "name price originalPrice thumbnail slug sold stock ratingAverage"
      );

    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      thumbnail: formatProductImage(p),
    }));

    res.json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params; // Lấy slug từ URL
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // 1. Tìm danh mục trước
    const category = await Category.findOne({
      slug: slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    // 2. Filter sản phẩm theo Category ID tìm được
    const filter = {
      category: category._id,
      isActive: true,
      isDeleted: false,
      status: "active",
    };

    // (Tuỳ chọn) Hỗ trợ thêm filter giá nếu Frontend có gửi
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // 3. Query sản phẩm
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    // 4. Format ảnh (Tái sử dụng hàm helper ở trên cùng file của bạn)
    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      thumbnail: formatProductImage(p), // Hàm này bạn đã có sẵn ở đầu file
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
    });
  } catch (error) {
    console.error("❌ getProductsByCategory error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
