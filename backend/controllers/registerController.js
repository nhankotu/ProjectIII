const db = require("../config/db");
const pendingUsers = require("./pendingUsers");
const validator = require("validator"); // Thêm thư viện validator để kiểm tra email hợp lệ

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Register user:", req.body);

  // Kiểm tra xem tất cả các trường có được nhập không
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tất cả các trường là bắt buộc!" });
  }

  // Kiểm tra email hợp lệ
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }

  try {
    // Kiểm tra xem tên đăng nhập có tồn tại không
    const [existingUsername] = await db
      .promise()
      .query("SELECT * FROM account WHERE username = ?", [username]);
    if (existingUsername.length > 0) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    // Kiểm tra xem email có tồn tại không
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM account WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    //lưu thông tin người dùng vào cơ sở dữ liệu
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO account (username, email, password) VALUES (?, ?, ?)",
        [username, email, password]
      );
    return res.status(200).json({
      message: "Xác thực thành công! Tài khoản đã được kích hoạt.",
      isVerified: true,
    });
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).json({
      message: "Lỗi khi đăng ký người dùng",
      error: err.message,
    });
  }
};

module.exports = registerUser;
