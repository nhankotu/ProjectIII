require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 5000;
console.log("✅ Đã chạy đến đây!");
// Cấu hình middleware cho CORS
const corsOptions = {
  origin: [
    "http://localhost:5174", // Truy cập từ localhost
    "http://192.168.1.67:5174", // Truy cập từ IP của máy tính
  ],
};

app.use(cors(corsOptions)); // Áp dụng CORS cho các yêu cầu
app.use(express.json());
// Định tuyến các route cho đăng ký và đăng nhập
app.use("/api/auth", authRoutes);

// Khởi động server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server đang chạy tại http://0.0.0.0:${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
