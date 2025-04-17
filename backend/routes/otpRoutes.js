// routes/otpRoutes.js
const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../controllers/otpController");

// Route gửi OTP
router.post("/send-otp", async (req, res) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ message: "User ID và email là bắt buộc!" });
  }

  try {
    await sendOTP(userId, email); // Gửi OTP
    res.status(200).json({ message: "OTP đã được gửi!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi gửi OTP", error: error.message });
  }
});

// Route xác thực OTP
router.post("/verify-otp", async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ message: "User ID và OTP là bắt buộc!" });
  }

  try {
    const result = await verifyOTP(userId, otp);
    if (result.status) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xác thực OTP", error: error.message });
  }
});

module.exports = router;
