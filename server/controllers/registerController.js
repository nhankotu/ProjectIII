import User from "../models/User.js";
import { sendOTPService, verifyOTPService } from "../services/otpService.js";
import bcrypt from "bcrypt"; // 🔥 1. Thêm import bcrypt

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, otp } = req.body;

    // Kiểm tra thông tin cơ bản
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    // Kiểm tra trùng dữ liệu
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
    }

    // --- LOGIC OTP GIỮ NGUYÊN ---
    if (!otp) {
      const result = await sendOTPService(email);
      if (!result.success)
        return res.status(500).json({ message: result.message });
      return res.status(200).json({ message: "OTP đã gửi đến email." });
    }

    const otpCheck = await verifyOTPService(email, otp);
    if (!otpCheck.success)
      return res.status(400).json({ message: otpCheck.message });

    // --- BẮT ĐẦU MÃ HÓA MẬT KHẨU TẠI ĐÂY ---
    // 🔥 2. Tạo salt và băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // OTP hợp lệ → tạo user với mật khẩu đã băm
    const isActiveStatus = role === "seller" ? false : true;

    const user = new User({
      username,
      email,
      password: hashedPassword, // 🔥 3. Lưu mật khẩu đã mã hóa thay vì password thuần
      role: role || "customer",
      isActive: isActiveStatus,
    });

    await user.save();

    if (role === "seller") {
      return res.status(201).json({
        success: true,
        message:
          "Đăng ký thành công! Tài khoản Seller đang chờ Admin phê duyệt.",
        requiresApproval: true,
      });
    }

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công!",
      requiresApproval: false,
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};
