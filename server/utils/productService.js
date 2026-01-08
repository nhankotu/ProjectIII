import cloudinary from "../config/cloudinary.js"; // Đảm bảo đường dẫn đúng
import Brand from "../models/Brand.js";
import slugify from "slugify";
import mongoose from "mongoose";

// ☁️ Helper: Upload file lên Cloudinary (Dùng Stream)
export const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: resourceType },
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          resolve(null); // Trả về null để không crash app
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// 🏷️ Helper: Xử lý Brand (Tìm kiếm hoặc Tạo mới)
export const resolveBrand = async (id, name) => {
  // 1. Nếu có ID hợp lệ -> Ưu tiên dùng ID
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    const brand = await Brand.findById(id);
    if (brand) return brand._id;
  }

  // 2. Nếu không có ID, check theo Name
  if (!name) return null;

  const normalizedName = name.trim();
  const existingBrand = await Brand.findOne({
    name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
  });

  if (existingBrand) return existingBrand._id;

  // 3. Nếu chưa có -> Tạo Brand mới
  try {
    const newBrand = await Brand.create({
      name: normalizedName,
      slug: slugify(normalizedName, { lower: true, strict: true }),
      logo: "https://via.placeholder.com/150?text=" + normalizedName.charAt(0),
      isActive: true, // Model Brand nên có trường này
    });
    return newBrand._id;
  } catch (error) {
    console.error("Lỗi tạo Brand tự động:", error);
    return null;
  }
};

// 🖼️ Helper: Xóa file trên Cloudinary
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`🗑️ Đã xóa Cloudinary: ${publicId}`);
  } catch (error) {
    console.error(`❌ Lỗi xóa Cloudinary (${publicId}):`, error);
  }
};
