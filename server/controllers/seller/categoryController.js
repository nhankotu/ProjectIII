import Category from "../../models/Category.js";
import mongoose from "mongoose";

// ==========================================
// 1. LẤY DANH SÁCH DANH MỤC (Kèm cờ isLeaf)
// ==========================================
export const getSellerCategories = async (req, res) => {
  try {
    // 1. Lấy tất cả danh mục đang hoạt động
    const categories = await Category.find({ isActive: true })
      .select("_id name slug parentId image order")
      .sort({ order: 1, name: 1 })
      .lean();

    // 2. XỬ LÝ LOGIC "LÁ" (LEAF)
    // Tạo Set chứa ID của những thằng đang làm cha
    const parentIds = new Set(
      categories.filter((c) => c.parentId).map((c) => c.parentId.toString()),
    );

    // 3. Map để xác định isLeaf, sau đó FILTER ngay lập tức
    const leafCategories = categories
      .map((cat) => ({
        ...cat,
        isLeaf: !parentIds.has(cat._id.toString()), // True nếu không ai gọi mình là cha
        parentId: cat.parentId ? cat.parentId.toString() : null,
      }))
      .filter((cat) => cat.isLeaf === true); // <--- CHỈ GIỮ LẠI LÁ

    // (Optional) Logic tạo Breadcrumb/Path nếu cần thiết
    // Vì nếu chỉ trả về "iPhone" mà không có "Điện thoại", user có thể bị rối.
    // Bạn có thể xử lý nối chuỗi tên cha vào đây nếu muốn.

    res.json({
      success: true,
      count: leafCategories.length,
      data: leafCategories,
    });
  } catch (error) {
    console.error("Lỗi lấy danh mục seller:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách danh mục",
    });
  }
};
// ==========================================
// 2. LẤY CHI TIẾT DANH MỤC (Kèm breadcrumb cha)
// ==========================================
export const getSellerCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    const category = await Category.findById(id).lean();

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại hoặc đã bị khóa",
      });
    }

    // Lấy thông tin danh mục cha (để hiển thị kiểu: Điện tử > Điện thoại)
    let parentName = null;
    let fullPath = category.name; // Tên đầy đủ dạng breadcrumb

    if (category.parentId) {
      const parent = await Category.findById(category.parentId)
        .select("name")
        .lean();

      if (parent) {
        parentName = parent.name;
        fullPath = `${parent.name} > ${category.name}`;
      }
    }

    res.json({
      success: true,
      data: {
        ...category,
        parentName,
        fullPath, // Trả thêm cái này để hiển thị cho đẹp
      },
    });
  } catch (error) {
    console.error("Error detail category:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lấy thông tin danh mục",
    });
  }
};
