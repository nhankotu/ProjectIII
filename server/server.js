// server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

import swaggerUi from "swagger-ui-express";

// ✅ IMPORT CÁC ROUTES HIỆN CÓ
import userRoutes from "./routes/users.js";
//admin
import adminSetupRoutes from "./routes/admin/adminRoutes.js";

//seller
import sellerRoutes from "./routes/seller/sellerRoutes.js";
import sellerDashboardRoutes from "./routes/seller/sellerDashboard.js";

// ✅ IMPORT CÁC ROUTES MỚI CHO customer
import customerRoutes from "./routes/customer/customerRoutes.js";

import { readFile } from "fs/promises";
const swaggerFile = JSON.parse(
  await readFile(new URL("./swagger-output.json", import.meta.url))
);

const app = express();

// ✅ Kết nối MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://project-iii-nine.vercel.app",
      "http://localhost:8080",
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==================== ROUTES HIỆN CÓ ====================
app.use("/api/users", userRoutes);

app.use("/api/admin", adminSetupRoutes);

app.use("/api/seller", sellerRoutes); // ✅ Routes seller hiện tại
app.use("/api/seller/dashboard", sellerDashboardRoutes);

app.use("/api", customerRoutes); // ✅ Route products MỚI - cho customer

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("✅ Server đang hoạt động...");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error("❌ Lỗi hệ thống:", err.stack);
  res.status(500).json({ error: err.message });
});

// 🔹 Nạp biến môi trường
dotenv.config();

const PORT = process.env.PORT || 5000;

// 🔹 Chạy server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
