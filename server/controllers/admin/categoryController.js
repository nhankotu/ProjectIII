import Category from "../../models/Category.js";
import slugify from "slugify";
import mongoose from "mongoose"; // Cần để check ID hợp lệ
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/productService.js";

// ==========================================
// 1. TẠO DANH MỤC (Có check cha/con)
// ==========================================
export const createCategory = async (req, res) => {
  try {
    const { name, description, parentId } = req.body;

    // 1. Validate cơ bản
    if (!name) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
    }

    // 2. Validate Parent Category (QUAN TRỌNG)
    // Nếu có gửi parentId, phải check xem nó có tồn tại trong DB không
    if (parentId && parentId !== "null" && parentId !== "") {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res
          .status(400)
          .json({ message: "ID danh mục cha không hợp lệ" });
      }

      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return res.status(404).json({ message: "Danh mục cha không tồn tại" });
      }
    }

    // 3. Xử lý Upload ảnh (Logic cũ của bạn)
    let imageUrl = null;
    if (req.files && req.files.images && req.files.images.length > 0) {
      const file = req.files.images[0];
      const result = await uploadToCloudinary(
        file.buffer,
        "categories",
        "image",
      );
      if (result) {
        imageUrl = result.url;
      }
    }

    // 4. Lưu vào DB
    const category = new Category({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      image: imageUrl,
      // Nếu parentId rỗng hoặc string "null" thì lưu là null (Cấp 1)
      parentId:
        parentId && parentId !== "null" && parentId !== "" ? parentId : null,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. XÓA DANH MỤC
// ==========================================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID danh mục không hợp lệ" });
    }

    // 2. Tìm danh mục cần xóa
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // 🔥 3. CHECK QUAN TRỌNG: Có danh mục con không?
    // Nếu tìm thấy bất kỳ danh mục nào có parentId bằng id này -> CHẶN
    const hasChildren = await Category.findOne({ parentId: id });
    if (hasChildren) {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa! Danh mục này đang chứa danh mục con. Vui lòng xóa các danh mục con trước.",
      });
    }

    // 🔥 4. CHECK SẢN PHẨM: Có sản phẩm nào thuộc danh mục này không?
    // (Nên giữ cái này để tránh sản phẩm bị lỗi không có danh mục)
    const hasProducts = await Product.findOne({ category: id });
    if (hasProducts) {
      return res.status(400).json({
        success: false,
        message:
          "Không thể xóa! Đang có sản phẩm thuộc danh mục này. Vui lòng xóa hoặc chuyển sản phẩm sang danh mục khác.",
      });
    }

    // 5. Nếu vượt qua hết các bước trên -> Tiến hành xóa ảnh trên Cloudinary
    if (category.image) {
      try {
        await deleteFromCloudinary(category.image);
      } catch (cloudErr) {
        console.error("Lỗi xóa ảnh Cloudinary:", cloudErr);
        // Vẫn cho xóa danh mục dù lỗi xóa ảnh (để tránh kẹt data)
      }
    }

    // 6. Xóa danh mục khỏi DB
    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Đã xóa danh mục thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 3. LẤY CÂY DANH MỤC (Cho Admin chọn cha)
// ==========================================
export const getAdminCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 }).lean();

    const createTree = (categories, parentId = null) => {
      const categoryList = [];
      let category;

      if (parentId == null) {
        category = categories.filter((cat) => !cat.parentId);
      } else {
        category = categories.filter(
          (cat) =>
            cat.parentId && cat.parentId.toString() == parentId.toString(),
        );
      }

      for (let cat of category) {
        categoryList.push({
          ...cat, // 🔥 SỬA Ở ĐÂY: Lấy toàn bộ thông tin (image, description, isActive...)
          children: createTree(categories, cat._id), // Gán thêm children
        });
      }

      return categoryList;
    };

    const categoryTree = createTree(categories);

    res.json({
      success: true,
      data: categoryTree,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
