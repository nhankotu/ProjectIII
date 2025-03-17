// backend/controllers/authController.js

const bcrypt = require("bcryptjs");
const db = require("../config/db"); // Kết nối cơ sở dữ liệu

// Hàm xử lý đăng ký
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const query = "SELECT * FROM account WHERE email = ?";
    const [results] = await db.execute(query, [email]);

    if (results.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu người dùng vào cơ sở dữ liệu
    const insertQuery =
      "INSERT INTO account (username, email, password) VALUES (?, ?, ?)";
    await db.execute(insertQuery, [username, email, hashedPassword]);

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error("Lỗi khi đăng ký:", err);
    res.status(500).json({ message: "Lỗi khi đăng ký người dùng" });
  }
};

// Hàm xử lý đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const query = "SELECT * FROM account WHERE email = ?";
    const [results] = await db.execute(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const user = results[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Đăng nhập thành công
    res.status(200).json({
      message: "Đăng nhập thành công",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    res.status(500).json({ message: "Lỗi truy vấn cơ sở dữ liệu" });
  }
};
