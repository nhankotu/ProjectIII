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
    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ message: "Đăng ký thành công!", user });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};
