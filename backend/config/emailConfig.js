const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // or 'STARTTLS'
  auth: {
    user: "tranduchai3241@gmail.com", // Thay đổi thành email của bạn
    pass: "Nhan5404@", // Thay đổi thành mật khẩu ứng dụng của bạn
  },
});

module.exports = transporter;
