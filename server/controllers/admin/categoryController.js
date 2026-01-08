import Category from "../../models/Category.js";
import slugify from "slugify";

// --- PUBLIC (Ai cũng xem được) ---

// --- ADMIN ONLY ---
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name)
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });

    const category = new Category({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      image, // URL ảnh upload lên Cloudinary
    });

    await category.save();
    res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Đã xóa danh mục" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
