const express = require("express");
const router = express.Router();

const registerUser = require("../controllers/registerController");
const loginUser = require("../controllers/loginController");
const sendOtp = require("../controllers/otpController"); // Sử dụng controller sendOTP
const verifyOtp = require("../controllers/verifyOTPController"); // Sử dụng controller verifyOtp

// Route đăng ký
router.post("/register", registerUser);
router.post("/login", loginUser);

// Route OTP
router.post("/send-otp", sendOtp); // Gửi OTP
router.post("/verify-otp", verifyOtp); // Xác minh OTP

module.exports = router;
