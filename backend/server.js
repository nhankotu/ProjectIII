require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/UserRoutes");
const otpRoutes = require("./routes/otpRoutes");
const app = express();
const port = process.env.PORT || 5000;

// Cấu hình middleware cho CORS
const corsOptions = {
  origin: [
    "http://localhost:5174", // Truy cập từ localhost
    "http://192.168.1.67:5174", // Truy cập từ IP của máy tính
  ],
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS", // Cho phép tất cả các phương thức HTTP
  allowedHeaders: ["Content-Type", "Authorization"], // Cho phép gửi Token
};

app.use(cors(corsOptions)); // Áp dụng CORS cho tất cả các request
app.options("*", cors(corsOptions)); // Xử lý preflight request từ trình duyệt

app.use(express.json());

// Định tuyến các route
app.use("/api/auth", authRoutes); // Đăng ký, đăng nhập
app.use("/api/user", userRoutes); // API lấy thông tin người dùng
app.use("/api", categoryRoutes); // Danh mục sản phẩm
app.use("/api/otp", otpRoutes);

// Khởi động server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server đang chạy tại http://localhost:${port}`);
});
