// controllers/admin/authController.js
import User from "../../models/User.js";

export const createAdmin = async (req, res) => {
  try {
    // 1. Nhận thêm 'name' từ body (để Admin có tên thật thay vì Random)
    const { email, password, name } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp email và password!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự!",
      });
    }

    // 2. Kiểm tra tồn tại (Logic: Email trùng là chặn)
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email này đã được sử dụng!",
      });
    }

    // 3. Tạo Admin mới (Đồng bộ với Model)
    const newAdmin = new User({
      // SỬA 1: Dùng 'name' thay vì 'username'
      name: name || "Admin " + Math.floor(Math.random() * 1000),

      email: email.toLowerCase(),

      password: password,

      role: "admin",

      isActive: true,

      isEmailVerified: true,
    });

    await newAdmin.save();

    // console.log("✅ Admin mới được tạo bởi:", req.user?.email);

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản admin mới thành công!",
      data: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name, // Trả về name
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi tạo admin:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
    });
  }
};
