require("dotenv").config({ path: "../.env" });
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Email gửi OTP
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng hoặc mật khẩu email
  },
});

const sendTestEmail = async () => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: "nhankotu@gmail.com", // Địa chỉ email thử nghiệm
    subject: "Kiểm tra kết nối",
    text: "Đây là một email thử nghiệm.",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi: " + info.response);
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

sendTestEmail(); // Gọi hàm để gửi email thử nghiệm
