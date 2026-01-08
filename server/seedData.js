// File: migrate.js
import mongoose from "mongoose";
import User from "./models/User.js"; // Sửa lại đường dẫn trỏ đúng vào file model User của bạn
import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường nếu chuỗi kết nối ở trong .env

const migrateUsers = async () => {
  try {
    // 1. Kết nối DB
    await mongoose.connect(process.env.MONGO_URI); // Hoặc điền trực tiếp string kết nối vào đây
    console.log("Đã kết nối DB...");

    // 2. Chạy lệnh update
    // Tìm tất cả user CHƯA có trường isActive và set thành true
    const result = await User.updateMany(
      { isActive: { $exists: false } }, // Chỉ update những người chưa có
      { $set: { isActive: true } }
    );

    console.log(
      `Đã cập nhật thành công cho ${result.modifiedCount} tài khoản.`
    );
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    // 3. Đóng kết nối
    mongoose.connection.close();
  }
};

migrateUsers();
