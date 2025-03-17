// backend/config/db.js

const mysql = require("mysql2");

// Kết nối với cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: "localhost", // Địa chỉ server MySQL
  user: "root", // Tên người dùng của bạn
  password: "1234", // Mật khẩu của bạn
  database: "webshop", // Tên cơ sở dữ liệu
});

// Kiểm tra kết nối cơ sở dữ liệu
db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối cơ sở dữ liệu:", err);
    return;
  }
  console.log("Kết nối đến cơ sở dữ liệu thành công!");
});

module.exports = db;
