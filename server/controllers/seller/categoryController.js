import Category from "../../models/Category.js";

// 📋 Lấy danh sách danh mục cho Seller (Tối ưu cho Dropdown)
// GET /api/seller/categories
export const getSellerCategories = async (req, res) => {
  try {
    // Chỉ lấy các danh mục đang hoạt động (isActive: true)
    // Chỉ lấy các trường cần thiết: _id, name
    const categories = await Category.find({ isActive: true })
      .select("_id name slug") // ⚡️ Chỉ select trường cần thiết để nhẹ payload
      .sort({ order: 1, name: 1 }); // Sắp xếp theo thứ tự ưu tiên hoặc tên

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi lấy danh mục seller:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách danh mục",
      error: error.message,
    });
  }
};

// 🔍 (Optional) Lấy chi tiết danh mục nếu Seller cần xem quy định của danh mục đó
export const getSellerCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại hoặc đã bị khóa",
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
