import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // 👇 THÊM 'await' VÀO ĐÂY
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // In ra host và tên Database để chắc chắn bạn đã vào đúng cái mới
    console.log(`✅ Đã kết nối MongoDB thành công: ${conn.connection.host}`);
    console.log(`📂 Database đang dùng: ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌ Lỗi kết nối MongoDB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
