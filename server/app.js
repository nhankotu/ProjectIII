// app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import reviewRoutes from "./routes/reviews.js";
import adminSetupRoutes from "./routes/adminSetup.js";
import adminProducts from "./routes/adminProducts.js";
import sellerRoutes from "./routes/sellerRoutes.js";
const app = express();

// ✅ Kết nối MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://project-iii-nine.vercel.app"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminSetupRoutes);
app.use("/api/admin/products", adminProducts);
app.use("/api/seller", sellerRoutes);
// Kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("✅ Server đang hoạt động...");
});

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error("❌ Lỗi hệ thống:", err.stack);
  res.status(500).json({ error: err.message });
});

export default app;
