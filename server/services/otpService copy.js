import OTP from "../models/otp.js";
import { transporter } from "../config/email.js";

export const sendOTPService = async (email) => {
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Xóa OTP cũ trước khi tạo mới
    await OTP.deleteMany({ email });

    const otpRecord = await OTP.create({
      email: email.trim().toLowerCase(),
      otp: otpCode,
      expiresAt,
    });

    // Gửi email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Mã OTP đăng ký",
      text: `Mã OTP của bạn là: ${otpCode}. Hết hạn trong 5 phút.`,
    });

    console.log("✅ Đã gửi OTP qua email");
    return { success: true, message: "OTP đã được gửi đến email!" };
  } catch (error) {
    console.error("❌ Lỗi gửi OTP:", error);
    return { success: false, message: "Lỗi server khi gửi OTP" };
  }
};

export const verifyOTPService = async (email, otp) => {
  try {
    if (!email || !otp) {
      console.log("❌ Thiếu email hoặc OTP");
      return { success: false, message: "Email và OTP là bắt buộc." };
    }

    // Chuẩn hóa dữ liệu
    const cleanOTP = otp.toString().trim();
    const cleanEmail = email.trim().toLowerCase();

    // Tìm OTP gần nhất cho email
    const record = await OTP.findOne({ email: cleanEmail }).sort({
      createdAt: -1,
    });

    if (!record) {
      console.log("❌ Không tìm thấy OTP record cho email:", cleanEmail);

      // Kiểm tra xem có OTP nào trong database không
      const allOtps = await OTP.find({});
      console.log("📋 Tất cả OTP trong database:", allOtps);

      return { success: false, message: "OTP không hợp lệ." };
    }

    // So sánh OTP
    if (record.otp !== cleanOTP) {
      console.log("❌ OTP không khớp");
      return { success: false, message: "OTP không hợp lệ." };
    }

    // Kiểm tra hết hạn
    if (record.expiresAt < new Date()) {
      console.log("❌ OTP đã hết hạn");
      return { success: false, message: "OTP đã hết hạn." };
    }

    // Xác thực thành công, xóa OTP
    await OTP.deleteOne({ _id: record._id });
    console.log("✅ OTP hợp lệ, đã xóa");

    return { success: true, message: "Xác thực OTP thành công!" };
  } catch (error) {
    console.error("💥 Lỗi xác thực OTP:", error);
    return { success: false, message: "Lỗi server khi xác thực OTP" };
  }
};
