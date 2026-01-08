import Category from "../../models/Category.js";
import Product from "../../models/Product.js";

// 📋 Lấy danh sách danh mục (Kèm số lượng sản phẩm)
export const getCategories = async (req, res) => {
  try {
    // Lấy danh mục đang hoạt động
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
      name: 1,
    });

    // Tính toán productCount cho mỗi category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        // 🛠️ SỬA QUAN TRỌNG: Đếm sản phẩm dựa trên Model Product MỚI
        const productCount = await Product.countDocuments({
          category: category._id,
          isActive: true, // Sản phẩm đang bật
          isDeleted: false, // Sản phẩm chưa bị xóa
          status: "active", // Sản phẩm đã duyệt
        });

        return {
          ...category.toObject(),
          productCount,
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount,
      total: categoriesWithCount.length,
    });
  } catch (error) {
    console.error("Lỗi lấy danh mục:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔍 Lấy chi tiết danh mục theo ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔗 Lấy chi tiết danh mục theo Slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📂 Lấy tất cả danh mục (Dạng đơn giản cho Menu/Dropdown)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select("name slug image parent") // Lấy thêm parent nếu sau này làm đa cấp
      .sort({ order: 1 });

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 📂 Dành riêng cho Header / Menu
export const getMenuCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    })
      .select("name slug image parent order")
      .sort({ order: 1 });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
