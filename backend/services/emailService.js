const emailService = require("emailService");

exports.sendOTP = async (email, otp) => {
  const subject = "Xác minh OTP";
  const text = `Mã OTP của bạn là: ${otp}`;
  await emailService.sendEmail(email, subject, text); // Gửi OTP đến email
};
