// server.js
import dotenv from "dotenv";
import app from "./app.js";

// 🔹 Nạp biến môi trường
dotenv.config();

const PORT = process.env.PORT || 5000;

// 🔹 Chạy server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
