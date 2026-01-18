import mongoose from "mongoose";

const flashSaleSchema = new mongoose.Schema(
  {
    // 1. Thông tin chung về sự kiện (Do Admin tạo)
    title: { type: String, required: true }, // VD: "Flash Sale khung 12h - 14h"
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    image: String, // Banner của khung giờ này
    isActive: { type: Boolean, default: true }, // Admin có thể tạm ẩn sự kiện

    // 2. Danh sách sản phẩm đăng ký (Quan trọng nhất)
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        seller: {
          // Thêm field này để dễ query xem Shop nào đăng ký
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shop", // Hoặc ref: "User" tùy logic bạn lưu Shop
          required: true,
        },
        originalPrice: Number, // Giá gốc lúc đăng ký (để so sánh)
        salePrice: { type: Number, required: true },
        limitQuantity: { type: Number, default: 10 }, // Số lượng shop đăng ký bán
        soldQuantity: { type: Number, default: 0 }, // Số lượng đã bán được

        // --- TRẠNG THÁI DUYỆT NẰM Ở ĐÂY ---
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending", // Mặc định là chờ Admin duyệt
        },
        rejectReason: String, // Lý do từ chối (nếu có) riêng cho sản phẩm này
      },
    ],
  },
  { timestamps: true }
);

// Index để tìm nhanh các Flash Sale đang diễn ra
flashSaleSchema.index({ startTime: 1, endTime: 1, isActive: 1 });

export default mongoose.model("FlashSale", flashSaleSchema);
