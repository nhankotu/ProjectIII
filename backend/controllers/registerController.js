// controllers/registerController.js
const db = require("../config/db");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tất cả các trường là bắt buộc!" });
  }

  try {
    const [existingUsername] = await db
      .promise()
      .query("SELECT * FROM account WHERE username = ?", [username]);

    if (existingUsername.length > 0) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM account WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

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
      message: "Lỗi khi đăng ký người dùng",
      error: err.message,
    });
  }
};

module.exports = registerUser;
