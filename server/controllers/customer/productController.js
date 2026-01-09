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
   GET PRODUCTS (Pagination + Filter + Category Slug)
   ========================================================= */
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    /* ---------- FILTER CƠ BẢN ---------- */
    const filter = {
      isActive: true,
      isDeleted: false,
      status: "active",
    };
    /* ---------- FILTER: CATEGORY ID () ---------- */
    if (req.query.category) {
      filter.category = req.query.category;
    }

    /* ---------- FILTER: CATEGORY SLUG (customer) ---------- */
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

    /* ---------- FILTER: SEARCH ---------- */
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    /* ---------- FILTER: BRAND ---------- */
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    /* ---------- FILTER: PRICE RANGE ---------- */
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    /* ---------- QUERY DB ---------- */
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-description -shortDescription");

    const total = await Product.countDocuments(filter);

    /* ---------- FORMAT RESPONSE ---------- */
    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      thumbnail: formatProductImage(p),
    }));

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
