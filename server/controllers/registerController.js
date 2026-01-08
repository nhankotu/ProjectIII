import User from "../models/User.js";
import { sendOTPService, verifyOTPService } from "../services/otpService.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, otp } = req.body;
    console.log(req.body);

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

    // Step 1: Nếu chưa có otp → gửi OTP
    if (!otp) {
      const result = await sendOTPService(email);
      if (!result.success) {
        return res.status(500).json({ message: result.message });
      }

      return res.status(200).json({
        message:
          "OTP đã được gửi đến email. Vui lòng nhập OTP để hoàn tất đăng ký.",
      });
    }

    // Step 2: Nếu client gửi OTP → xác thực
    console.log("🔐 Xác thực OTP:", { email, otp });
    const otpCheck = await verifyOTPService(email, otp);
    console.log("📊 Kết quả xác thực OTP:", otpCheck);
    if (!otpCheck.success) {
      return res.status(400).json({ message: otpCheck.message });
    }

    // OTP hợp lệ → tạo user
    const isActiveStatus = role === "seller" ? false : true;
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "customer",
      isActive: isActiveStatus,
    });
    await user.save();

    if (role === "seller") {
      return res.status(201).json({
        success: true,
        message:
          "Đăng ký thành công! Tài khoản Seller đang chờ Admin phê duyệt.",
        requiresApproval: true, // Cờ để frontend biết hiển thị thông báo
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
