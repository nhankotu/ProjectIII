import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixOrderIndexes = async () => {
  try {
    // 1. Kết nối DB
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log("🚀 Đã kết nối MongoDB...");

    // 2. Truy cập vào collection 'orders'
    const ordersCollection = mongoose.connection.db.collection("orders");

    // 3. Lấy danh sách các Indexes hiện có để kiểm tra
    const indexes = await ordersCollection.indexes();
    console.log("🔍 Các Indexes hiện có trong bảng Orders:");
    console.log(indexes.map((idx) => idx.name));

    // 4. Kiểm tra và xóa Index "id_1" (thủ phạm gây lỗi)
    const hasIdIndex = indexes.some((idx) => idx.name === "id_1");

    if (hasIdIndex) {
      console.log("🔄 Đang xóa Index 'id_1' gây lỗi duplicate key...");
      await ordersCollection.dropIndex("id_1");
      console.log("✅ Đã xóa Index 'id_1' thành công!");
    } else {
      console.log(
        "💡 Không tìm thấy Index 'id_1'. Có vẻ nó đã được xóa trước đó."
      );
    }

    // 5. Kiểm tra thêm Index "orderCode_1" (nếu bạn muốn Mongoose tạo lại sạch sẽ)
    const hasOrderCodeIndex = indexes.some((idx) => idx.name === "orderCode_1");
    if (hasOrderCodeIndex) {
      console.log("🔄 Đang xóa Index 'orderCode_1' cũ để làm mới...");
      await ordersCollection.dropIndex("orderCode_1");
    }

    console.log("------------------------------------------");
    console.log("✅ TẤT CẢ ĐÃ XỬ LÝ XONG!");
    console.log("👉 Bây giờ bạn có thể đặt hàng mà không bị lỗi 500 nữa.");
  } catch (error) {
    console.error("❌ Lỗi trong quá trình xử lý Index:", error);
  } finally {
    // 6. Đóng kết nối
    mongoose.connection.close();
    console.log("🔌 Đã đóng kết nối Database.");
  }
};

fixOrderIndexes();
