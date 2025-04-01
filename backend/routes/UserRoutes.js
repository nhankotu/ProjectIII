const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Middleware xác thực người dùng
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin userId vào req
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

// API lấy thông tin người dùng
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    console.log("User ID from token:", req.user.userId);

    const [user] = await db
      .promise()
      .query(
        "SELECT id, username, email, imgurl, ifmuser, address, phone FROM account WHERE id = ?",
        [req.user.userId]
      );

    if (user.length === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.json(user[0]); // Trả về thông tin user
  } catch (error) {
    console.error("Error in profile route:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// API cập nhật thông tin người dùng
router.put("/update", authenticateUser, async (req, res) => {
  const { username, imgurl, ifmuser, address, phone } = req.body;
  try {
    await db
      .promise()
      .query(
        "UPDATE account SET username=?, imgurl=?, ifmuser=?, address=?, phone=? WHERE id=?",
        [username, imgurl, ifmuser, address, phone, req.user.userId]
      );
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật", error: error.message });
  }
});

module.exports = router;
