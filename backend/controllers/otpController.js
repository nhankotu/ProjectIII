require("dotenv").config({ path: "../.env" });
const validator = require("validator");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const db = require("../config/db");

const sendOTP = async (req, res) => {
  const { email, username } = req.body;
  console.log(email, username);
  // Validate input
  if (!email || !username) {
    return res
      .status(400)
      .send({ message: "Email và tên người dùng là bắt buộc." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: "Địa chỉ email không hợp lệ." });
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });

  // Calculate expiration (5 minutes from now)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    // Kiểm tra xem email đã có trong bảng OTP chưa
    const [existing] = await db
      .promise()
      .query("SELECT * FROM otp_storage WHERE email = ?", [email]);
    if (!existing || existing.length === 0) {
      // Nếu chưa tồn tại thì INSERT
      await db
        .promise()
        .query(
          "INSERT INTO otp_storage (email, otp, expires_at) VALUES (?, ?, ?)",
          [email, otp, expiresAt]
        );
    } else if (existing && existing[0].expires_at > new Date()) {
      // Nếu tồn tại và chưa hết hạn thì trả lại lỗi
      return res
        .status(200)
        .send({ message: "Bạn đã nhận được OTP vui lòng không spam " });
    }

    if (existing.length > 0) {
      // Nếu đã tồn tại thì UPDATE
      await db
        .promise()
        .query(
          "UPDATE otp_storage SET otp = ?, expires_at = ? WHERE email = ?",
          [otp, expiresAt, email]
        );
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(process.env.EMAIL_USER);
    const username = email.split("@")[0];
    console.log(username);
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Xác minh OTP",
      text: `Xin chào ${username}, mã OTP của bạn là: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).send({ message: `OTP đã gửi đến email: ${email}` });
  } catch (error) {
    console.error("Lỗi gửi email hoặc lưu OTP:", error);
    return res.status(500).send({ message: "Lỗi xử lý OTP." });
  }
};

module.exports = sendOTP;
