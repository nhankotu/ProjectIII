import Product from "../../models/A.js";

// 🛠️ HÀM HELPER: Xử lý ảnh thông minh (Dùng chung cho các hàm bên dưới)
// Giúp Frontend luôn nhận được 1 đường link ảnh string, không bị lỗi object rỗng
const formatProductImage = (product) => {
  let thumbUrl = "https://via.placeholder.com/300"; // Ảnh mặc định

  if (product.thumbnail && product.thumbnail.url) {
    thumbUrl = product.thumbnail.url;
  } else if (
    typeof product.thumbnail === "string" &&
    product.thumbnail.length > 0
  ) {
    thumbUrl = product.thumbnail; // Trường hợp data cũ lưu string
  } else if (product.images && product.images.length > 0) {
    thumbUrl = product.images[0].url; // Lấy ảnh đầu tiên trong gallery
  }
  return thumbUrl;
};

// 🛒 Lấy danh sách sản phẩm (Pagination + Filter)
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // 1. Bộ lọc chuẩn Model mới
    const filter = {
      isActive: true,
      isDeleted: false, // 👈 QUAN TRỌNG: Không lấy hàng đã xóa
      status: "active",
    };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.search)
      filter.name = { $regex: req.query.search, $options: "i" };

    // Lọc theo Brand
    if (req.query.brand) filter.brand = req.query.brand;

    // Lọc theo khoảng giá (nếu cần)
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // 2. Query
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-description -shortDescription"); // Bỏ bớt text dài cho nhẹ

    const total = await Product.countDocuments(filter);

    // 3. Map lại dữ liệu để xử lý ảnh (tránh lỗi thumbnail rỗng)
    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      thumbnail: formatProductImage(p), // ✅ Trả về String URL chuẩn
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
    console.error("❌ Lỗi lấy sản phẩm:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 🔍 Lấy chi tiết 1 sản phẩm
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
      isDeleted: false, // 👈 Nhớ thêm dòng này
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

    // Với trang chi tiết, ta trả về nguyên gốc object để FE lấy được cả images[]
    // Nhưng vẫn nên xử lý thumbnail fallback nếu cần
    const productData = product.toObject();
    productData.thumbnail = formatProductImage(product);

    res.json({ success: true, data: productData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ⭐ Sản phẩm nổi bật (Featured)
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isDeleted: false,
      status: "active",
      ratingAverage: { $gte: 4 },
    })
      .sort({ ratingAverage: -1, sold: -1 }) // Ưu tiên: Nhiều sao nhất -> Bán chạy nhất
      .limit(8) // Lấy 8 sản phẩm
      .select(
        "name price originalPrice thumbnail slug sold stock ratingAverage"
      );

    // Helper xử lý ảnh (như đã viết ở trên)
    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      thumbnail: formatProductImage(p),
    }));

    res.json({ success: true, data: formattedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔥 Sản phẩm Hot (Bán chạy)
export const getHotProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isDeleted: false,
      status: "active",
    })
      .sort({ sold: -1 }) // ✅ Model mới dùng 'sold', khớp rồi!
      .limit(10)
      .select(
        "name price originalPrice thumbnail slug sold stock ratingAverage"
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
