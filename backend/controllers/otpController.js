// controllers/otpController.js
const db = require("../config/db");
const nodemailer = require("nodemailer");
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // OTP hết hạn sau 5 phút

// Tạo OTP ngẫu nhiên
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Tạo OTP 6 chữ số
};

// Gửi OTP qua email
const sendOTP = async (userId, email) => {
  const otp = generateOTP();

  // Lưu OTP vào cơ sở dữ liệu với thời gian hết hạn
  await db
    .promise()
    .query("INSERT INTO otp (userId, otp, expiresAt) VALUES (?, ?, ?)", [
      userId,
      otp,
      new Date(Date.now() + OTP_EXPIRY_TIME), // Đặt thời gian hết hạn
    ]);

  // Cấu hình Nodemailer để gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Xác thực OTP",
    text: `Mã OTP của bạn là: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Lỗi khi gửi OTP qua email");
  }
};

// Xác thực OTP
const verifyOTP = async (userId, otp) => {
  const [result] = await db
    .promise()
    .query(
      "SELECT * FROM otp WHERE userId = ? ORDER BY createdAt DESC LIMIT 1",
      [userId]
    );

  if (result.length === 0) {
    return { status: false, message: "Không tìm thấy OTP cho người dùng này" };
  }

  const otpData = result[0];
  const currentTime = new Date();

  if (currentTime > new Date(otpData.expiresAt)) {
    return { status: false, message: "OTP đã hết hạn" };
  }

  if (otpData.otp !== otp) {
    return { status: false, message: "OTP không đúng" };
  }

  return { status: true, message: "Xác thực OTP thành công" };
};

module.exports = { sendOTP, verifyOTP };
