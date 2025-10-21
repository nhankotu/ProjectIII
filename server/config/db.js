import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Đã kết nối MongoDB thành công");
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1); // Dừng server nếu kết nối thất bại
  }
};

export default connectDB;
