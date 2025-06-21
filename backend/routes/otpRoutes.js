const express = require("express");
const router = express.Router();
const { verifyOTP } = require("../controllers/otpController");
const { saveUser } = require("../controllers/registerController"); // Import hàm lưu người dùng

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const verificationResult = await verifyOTP(email, otp);

  if (!verificationResult.status) {
    return res.status(400).json({ message: verificationResult.message });
  }

  // Nếu OTP xác thực thành công, gọi hàm saveUser để lưu người dùng vào cơ sở dữ liệu
  await saveUser(email);

  res.status(200).json({ message: verificationResult.message });
});

module.exports = router;
