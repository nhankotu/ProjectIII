const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Đăng ký người dùng
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tất cả các trường là bắt buộc!" });
  }

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const [existingUsername] = await db
      .promise()
      .query("SELECT * FROM account WHERE username = ?", [username]);

    if (existingUsername.length > 0) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM account WHERE email = ?", [email]);
    //
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email  đã tồn tại" });
    }

    // Lưu người dùng vào cơ sở dữ liệu mà không mã hóa mật khẩu
    await db
      .promise()
      .query(
        "INSERT INTO account (username, email, password) VALUES (?, ?, ?)",
        [username, email, password]
      );

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).json({
      message: "Lỗi khi đăng ký người dùng: UserName đã tồn tại ",
      error: err.message,
    });
  }
});

// Đăng nhập người dùng
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tất cả các trường là bắt buộc!" });
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const [result] = await db
      .promise()
      .query("SELECT * FROM account WHERE email = ?", [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const user = result[0];
    // Kiểm tra mật khẩu
    if (password !== user.password) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Kiểm tra xem JWT_SECRET có được thiết lập hay không
    if (!process.env.JWT_SECRET) {
      console.error("❌ LỖI: JWT_SECRET chưa được thiết lập trong file .env");
      return res
        .status(500)
        .json({ message: "Lỗi máy chủ, JWT_SECRET không tồn tại" });
    }

    // Tạo JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token }); // tra ve token cho frontend
  } catch (err) {
    console.error("❌ Database error:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi đăng nhập người dùng", error: err.message });
    c;
  }
});

module.exports = router;
