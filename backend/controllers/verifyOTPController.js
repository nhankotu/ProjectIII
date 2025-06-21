const db = require("../config/db");
const pendingUsers = require("./pendingUsers");

const verifyOTPAndCreateUser = async (req, res) => {
  const { email, otp } = req.body; // Lấy dữ liệu từ yêu cầu gửi lên
  console.log("OTP:", otp);
  console.log("Email:", email);
  try {
    // Bước 1: Xóa các OTP đã hết hạn
    await db
      .promise()
      .query("DELETE FROM otp_storage WHERE expires_at < NOW()");

    // Bước 2: Kiểm tra OTP hợp lệ
    const [rows] = await db
      .promise()
      .query("SELECT * FROM otp_storage WHERE email = ? AND otp = ?", [
        email,
        otp,
      ]);
    console.log("Rows:", rows);
    await db
      .promise()
      .query("DELETE FROM otp_storage WHERE email = ? AND otp = ?", [
        email,
        otp,
      ]);
    // Nếu không tìm thấy OTP hợp lệ
    if (rows.length === 0) {
      return res.status(400).json({
        message: "OTP không hợp lệ hoặc đã hết hạn",
        isVerified: false,
      });
    }

    return res.status(200).json({
      message: "Xác thực thành công! Tài khoản đã được kích hoạt.",
      isVerified: true,
    });
  } catch (error) {
    console.error("Lỗi trong quá trình xác thực:", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống khi xác thực OTP", error: error.message });
  }
};

module.exports = verifyOTPAndCreateUser;
