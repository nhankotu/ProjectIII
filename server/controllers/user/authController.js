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
    // 🔥 Sửa lại cách lấy ID cho chuẩn MongoDB
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message:
          "Không có file được tải lên. Hãy đảm bảo key gửi lên là 'avatar'",
      });
    }

    // Lấy thông tin user hiện tại
    const currentUser = await User.findById(userId);
    if (!currentUser)
      return res.status(404).json({ message: "User không tồn tại" });

    // Upload lên Cloudinary từ đường dẫn file tạm (Disk Storage)
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "avatars",
    });

    // Xóa file tạm ở local sau khi đã lên mây
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Cập nhật Database
    const oldAvatarUrl = currentUser.avatar;
    currentUser.avatar = result.secure_url;
    await currentUser.save();

    // Xóa ảnh cũ trên Cloudinary (nếu có)
    if (oldAvatarUrl && oldAvatarUrl.includes("cloudinary")) {
      try {
        const publicId = `avatars/${
          oldAvatarUrl.split("/").pop().split(".")[0]
        }`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Không xóa được ảnh cũ:", err.message);
      }
    }

    res.json({
      success: true,
      message: "Cập nhật ảnh đại diện thành công!",
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
    });
  } catch (error) {
    console.error("Lỗi upload avatar:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};
