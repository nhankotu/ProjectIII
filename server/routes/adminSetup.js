// routes/adminSetup.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/admin/setup - Tạo tài khoản admin (không mã hóa password)
router.post("/setup", async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    console.log("📨 Request tạo admin:", { email, secretKey });

    // 1. Kiểm tra secret key
    if (secretKey !== "ADMIN_SETUP_2024") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập!",
      });
    }

    // 2. Kiểm tra email và password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp email và password!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password phải có ít nhất 6 ký tự!",
      });
    }

    // 3. Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({
      $or: [{ email: email }, { role: "admin" }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin đã tồn tại!",
        existingAdmin: {
          email: existingAdmin.email,
          role: existingAdmin.role,
        },
      });
    }

    // 4. Tạo admin user (KHÔNG MÃ HÓA PASSWORD)
    const adminUser = new User({
      username: "admin",
      email: email.toLowerCase(),
      password: password, // Lưu password trực tiếp, không mã hóa
      role: "admin",
      isVerified: true,
      status: "active",
    });

    await adminUser.save();

    console.log("✅ Đã tạo admin thành công:", adminUser.email);
    console.log("⚠️ CẢNH BÁO: Password chưa được mã hóa!");

    // 5. Trả về response
    res.status(201).json({
      success: true,
      message: "Tạo tài khoản admin thành công!",
      user: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
        status: adminUser.status,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi tạo admin:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo admin!",
      error: error.message,
    });
  }
});

export default router;
