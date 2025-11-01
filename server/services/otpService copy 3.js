import OTP from "../models/otp.js";
import sgMail from "@sendgrid/mail";

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOTPService = async (email) => {
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Xóa OTP cũ trước khi tạo mới
    await OTP.deleteMany({ email });

    await OTP.create({
      email: email.trim().toLowerCase(),
      otp: otpCode,
      expiresAt,
    });

    // Gửi email qua SendGrid
    const msg = {
      to: email,
      from: "your-verified-email@gmail.com", // Email đã verify trong SendGrid
      subject: "Mã OTP đăng ký tài khoản",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Xác thực tài khoản</h2>
          <p>Mã OTP để đăng ký tài khoản của bạn là:</p>
          <div style="background: #f3f4f6; padding: 16px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p>Mã có hiệu lực trong <strong>5 phút</strong>.</p>
          <p style="color: #6b7280; font-size: 14px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    console.log("✅ Đã gửi OTP qua SendGrid");
    return { success: true, message: "OTP đã được gửi đến email!" };
  } catch (error) {
    console.error("❌ Lỗi gửi OTP qua SendGrid:", error);
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
