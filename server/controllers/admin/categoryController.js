import Category from "../../models/Category.js";
import slugify from "slugify";
import {
  uploadToCloudinary,
  resolveBrand,
  deleteFromCloudinary,
} from "../../utils/productService.js"; // Import từ file trên

// --- ADMIN ONLY ---
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Kiểm tra tên bắt buộc (Validation)
    if (!name) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
    }

    // 1. Khởi tạo URL ảnh mặc định là rỗng
    let imageUrl = "";

    // 2. Xử lý Upload ảnh (Chỉ chạy khi có file gửi lên)
    if (req.files && req.files.images && req.files.images.length > 0) {
      const file = req.files.images[0];
      const result = await uploadToCloudinary(
        file.buffer,
        "categories",
        "image"
      );

      if (result) {
        imageUrl = result.url; // Gán URL từ Cloudinary vào biến chung
        console.log("Upload ảnh thành công:", imageUrl);
      }
    }

    // ✅ 3. Tạo Category (NẰM NGOÀI KHỐI IF)
    // Dù có ảnh hay không, code vẫn chạy đến đây để tạo danh mục
    const category = new Category({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      image: imageUrl, // Sử dụng giá trị đã xử lý (URL hoặc rỗng)
    });

    await category.save();

    // ✅ 4. Luôn trả về phản hồi cho người dùng
    res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    // Trả về lỗi 500 nếu có sự cố bất ngờ để tránh treo FE
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
