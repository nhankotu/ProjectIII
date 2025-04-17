// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const registerUser = require("../controllers/registerController");
const loginUser = require("../controllers/loginController");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
