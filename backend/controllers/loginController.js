// controllers/loginController.js
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tất cả các trường là bắt buộc!" });
  }

  try {
    const [result] = await db
      .promise()
      .query("SELECT * FROM account WHERE email = ?", [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const user = result[0];

    if (password !== user.password) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET chưa được thiết lập");
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ message: "Lỗi khi đăng nhập", error: err.message });
  }
};

module.exports = loginUser;
