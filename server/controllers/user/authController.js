import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import cloudinary from "../../config/cloudinary.js"; // 👈 THÊM IMPORT NÀY
import fs from "fs"; // 👈 THÊM IMPORT NÀY
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// Auth check endpoint - trả về user thật
export const authCheck = async (req, res) => {
  try {
    // User thật đã được set bởi middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        // Thêm các field khác từ user thật
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authentication check",
    });
  }
};

// Upload avatar endpoint
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Không có file được tải lên",
      });
    }

    console.log("🔄 Uploading avatar to Cloudinary...");

    // Config Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Lấy thông tin user hiện tại để xóa ảnh cũ
    const currentUser = await User.findById(userId);
    const oldAvatarUrl = currentUser.avatar;

    // Upload ảnh mới lên Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "avatars",
    });

    // Xóa file tạm sau khi upload
    fs.unlinkSync(file.path);

    console.log("✅ Avatar uploaded to Cloudinary:", result.secure_url);

    // Cập nhật user với avatar URL mới
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true }
    ).select("-password");

    // 🔥 XÓA ẢNH CŨ TRÊN CLOUDINARY (nếu có)
    if (oldAvatarUrl && oldAvatarUrl.includes("cloudinary")) {
      try {
        // Extract public_id từ URL
        const urlParts = oldAvatarUrl.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `avatars/${filename.split(".")[0]}`;

        console.log("🗑️ Deleting old avatar:", publicId);

        await cloudinary.uploader.destroy(publicId);
        console.log("✅ Old avatar deleted successfully");
      } catch (deleteError) {
        console.error("⚠️ Could not delete old avatar:", deleteError.message);
        // Không throw error vì upload ảnh mới đã thành công
      }
    }

    res.json({
      success: true,
      message: "Upload avatar thành công!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Lỗi upload avatar:", error);

    // Xóa file tạm nếu có lỗi
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
