// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import { readFile } from "fs/promises";

import { createServer } from "http";
import { Server } from "socket.io";

// IMPORT CÁC ROUTES
import userRoutes from "./routes/users.js";
import adminSetupRoutes from "./routes/admin/adminRoutes.js";
import sellerRoutes from "./routes/seller/sellerRoutes.js";
import sellerDashboardRoutes from "./routes/seller/sellerDashboard.js";
import customerRoutes from "./routes/customer/customerRoutes.js";

// Đọc file swagger
const swaggerFile = JSON.parse(
  await readFile(new URL("./swagger-output.json", import.meta.url)),
);

const app = express();

const httpServer = createServer(app);

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://project-iii-nine.vercel.app",
  "http://localhost:8080",
];

// Middleware Express
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 3. CẤU HÌNH SOCKET.IO
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("socketio", io);

let onlineUsers = new Map();

io.on("connection", (socket) => {
  // -------------------------------------------------------
  // 1. NGAY KHI VỪA KẾT NỐI (Bắt trường hợp Login/F5 trang)
  // -------------------------------------------------------
  const userIdFromQuery = socket.handshake.query.userId;

  if (userIdFromQuery && userIdFromQuery !== "undefined") {
    // Lưu ngay vào danh sách Online
    onlineUsers.set(String(userIdFromQuery), socket.id);

    // 🔥 QUAN TRỌNG: Phát loa cho cả làng biết có người mới vào
    io.emit("get_users", Array.from(onlineUsers.keys()));

    console.log(`🔌 [Auto-Connect] User ${userIdFromQuery} đã Online`);
  }

  // -------------------------------------------------------
  // 2. SỰ KIỆN ADD_USER (Fallback cho code cũ hoặc khi Login)
  // -------------------------------------------------------
  socket.on("add_user", (userId) => {
    if (userId) {
      onlineUsers.set(String(userId), socket.id);

      // 🔥 QUAN TRỌNG: Phát loa lần nữa để chắc chắn
      io.emit("get_users", Array.from(onlineUsers.keys()));

      console.log(`✅ [Add-User] User ${userId} đã báo danh`);
    }
  });

  // -------------------------------------------------------
  // 3. GỬI TIN NHẮN (Giữ nguyên code đã fix trước đó)
  // -------------------------------------------------------
  socket.on("sendMessage", (data) => {
    const receiverIdString = String(data.receiverId);
    const receiverSocketId = onlineUsers.get(receiverIdString);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", data);
    }
  });

  // -------------------------------------------------------
  // 4. NGẮT KẾT NỐI
  // -------------------------------------------------------
  socket.on("disconnect", () => {
    let disconnectedUserId = null;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      console.log(`🔴 User ${disconnectedUserId} đã thoát`);
      // 🔥 Cập nhật danh sách mới cho mọi người
      io.emit("get_users", Array.from(onlineUsers.keys()));
    }
  });
});

// ==================== ROUTES ====================
app.use("/api/users", userRoutes);
app.use("/api/admin", adminSetupRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/seller/dashboard", sellerDashboardRoutes);
app.use("/api", customerRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes cơ bản
app.get("/", (req, res) => {
  res.send("✅ Server đang hoạt động...");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Lỗi hệ thống:", err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`🔌 Socket.io đã sẵn sàng kết nối`);
});
