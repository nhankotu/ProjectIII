//backend/routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
router.post("/home/user", async (req, res) => {
  const { phone, address, ifm_user } = req.body;

  if (!phone || !address || ifm_user) {
    return res.status(400).json({ message: "Tất cả các trường là bắt buộc!" });
  }
  try {
    // Lưu người dùng vào cơ sở dữ liệu
    await db
      .promise()
      .query(
        "INSERT INTO account (phone, address, ifm_user) VALUES (?, ?, ?)",
        [phone, address, ifm_user]
      );

    res.status(201).json({ message: "Cap nhat thong tin thành công!" });
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin ",
      error: err.message,
    });
  }
});
