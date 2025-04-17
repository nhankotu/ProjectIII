//emailConfig.js

const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // or 'STARTTLS'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,

    // user: "tranduchai3241@gmail.com", // Thay đổi thành email của bạn
    // pass: "Nhan5404@", // Thay đổi thành mật khẩu ứng dụng của bạn
  },
});

module.exports = transporter;
