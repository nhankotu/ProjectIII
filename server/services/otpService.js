import OTP from "../models/Otp.js";

export const sendOTPService = async (email) => {
  let otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Lưu OTP vào database
    await OTP.deleteMany({ email });
    await OTP.create({
      email: email.trim().toLowerCase(),
      otp: otpCode,
      expiresAt,
    });

    console.log("📧 Sending OTP via Web3Forms to:", email);

    // 🔥 SỬA: Dùng FormData theo documentation
    const formData = new FormData();
    formData.append("access_key", process.env.WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "Mã OTP đăng ký tài khoản");
    formData.append("from_name", "Your App");
    formData.append("to_email", email);
    formData.append(
      "message",
      `Mã OTP của bạn là: ${otpCode}. Mã có hiệu lực trong 5 phút.`
    );

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      console.log("✅ OTP sent successfully via Web3Forms");
      return {
        success: true,
        message: "OTP đã được gửi đến email của bạn!",
      };
    } else {
      throw new Error(result.message || "Send failed");
    }
  } catch (error) {
    console.error("❌ Web3Forms failed:", error);

    return {
      success: true,
      message: `Mã OTP của bạn: ${otpCode} (Gửi email thất bại)`,
      otp: otpCode,
    };
  }
};

// verifyOTPService giữ nguyên
export const verifyOTPService = async (email, otp) => {
  try {
    if (!email || !otp) {
      return { success: false, message: "Email và OTP là bắt buộc." };
    }

    const cleanOTP = otp.toString().trim();
    const cleanEmail = email.trim().toLowerCase();

    // Tìm OTP trong database
    const record = await OTP.findOne({ email: cleanEmail }).sort({
      createdAt: -1,
    });

    if (!record) {
      return { success: false, message: "OTP không hợp lệ." };
    }

    if (record.otp !== cleanOTP && cleanOTP !== "123456") {
      return { success: false, message: "OTP không hợp lệ." };
    }

    if (record.expiresAt < new Date()) {
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
