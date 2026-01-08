// controllers/admin/authController.js
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

export const createAdmin = async (req, res) => {
  try {
    // Không cần lấy secretKey nữa
    const { email, password } = req.body;

    // console.log("Người thực hiện tạo:", req.user.username); // Có thể lấy thông tin người tạo từ req.user

    // 1. Validate input (Bỏ bước check Secret Key)
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

    // 2. Kiểm tra tồn tại
    const existingAdmin = await User.findOne({
      $or: [{ email: email }, { role: "admin" }],
      // ⚠️ Lưu ý: Logic này nghĩa là nếu email trùng HOẶC đã có bất kỳ admin nào thì chặn.
      // Nếu bạn muốn cho phép nhiều admin, hãy sửa dòng trên thành: { email: email } thôi.
    });

    // Sửa lại logic check tồn tại để cho phép nhiều admin (nếu muốn):
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email này đã được sử dụng!" });
    }

    // 3. Tạo Admin mới
    const newAdmin = new User({
      username: "Admin " + Math.floor(Math.random() * 1000), // Tạo tên ngẫu nhiên hoặc yêu cầu nhập
      email: email.toLowerCase(),
      password: password, // Vẫn giữ logic không mã hóa theo yêu cầu của bạn
      role: "admin",
      isVerified: true,
      status: "active",
    });

    await newAdmin.save();

    console.log("✅ Admin mới được tạo bởi:", req.user.email);

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản admin mới thành công!",
      data: {
        id: newAdmin._id,
        email: newAdmin.email,
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
