import Category from "../../models/Category.js";
import Product from "../../models/Product.js";

const listToTree = (list) => {
  const map = {};
  const nodeIds = [];
  const tree = [];

  list.forEach((node, index) => {
    map[node._id] = index;
    nodeIds.push(node._id.toString());
    // Thêm mảng children trống cho mỗi node
    list[index].children = [];
  });

  list.forEach((node) => {
    if (node.parent && nodeIds.includes(node.parent.toString())) {
      // Nếu có cha và cha nằm trong danh sách, đẩy vào children của cha
      list[map[node.parent]].children.push(node);
    } else {
      // Nếu không có cha hoặc cha không tồn tại trong list, đây là node gốc
      tree.push(node);
    }
  });
  return tree;
};
export const getCategories = async (req, res) => {
  try {
    // 1. Lấy danh mục đang hoạt động
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
      name: 1,
    });

    // 2. Tính toán productCount
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        // 🔥 ĐOẠN ĐÃ SỬA: Bỏ điều kiện isActive: true
        const productCount = await Product.countDocuments({
          category: category._id,
          status: "active", // ✅ Chỉ cần cái này là đủ (Logs báo có 1)
          isDeleted: { $ne: true }, // ✅ An toàn: chưa bị xóa
        });

        return {
          ...category.toObject(),
          productCount,
        };
      }),
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
    const categories = await Category.find({ isActive: true })
      .select("name slug image parent order")
      .sort({ order: 1 })
      .lean(); // Dùng .lean() để trả về plain JS object giúp thêm thuộc tính children dễ dàng

    const categoryTree = listToTree(categories);

    res.json({
      success: true,
      data: categoryTree,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
