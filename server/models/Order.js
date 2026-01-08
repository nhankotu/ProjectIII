// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 1. Thông tin Người mua (Buyer)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Bắt buộc phải có người mua
    },

    // 2. Thông tin Người bán (Seller) - QUAN TRỌNG CHO MULTI-VENDOR
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 3. Danh sách sản phẩm
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        // 🔥 SNAPSHOT: Lưu cứng các thông tin này để dù SP gốc bị xóa/sửa thì đơn hàng vẫn hiển thị đúng
        name: { type: String, required: true },
        thumbnail: String,
        price: { type: Number, required: true }, // Giá tại thời điểm chốt đơn
        quantity: { type: Number, required: true },
      },
    ],

    // 4. Địa chỉ & Liên hệ (Snapshot từ lúc đặt)
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },

    // 5. Tài chính
    itemsPrice: { type: Number, default: 0 }, // Tổng tiền hàng
    shippingPrice: { type: Number, default: 0 }, // Phí ship
    totalAmount: { type: Number, required: true }, // Tổng thanh toán (Hàng + Ship)

    // 6. Thanh toán
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY", "MOMO"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"], // Chờ thanh toán, Đã TT, Lỗi
      default: "pending",
    },

    // 7. Trạng thái đơn hàng (Quy trình chuẩn)
    status: {
      type: String,
      enum: [
        "pending", // Chờ xác nhận (Seller chưa xem)
        "confirmed", // Đã xác nhận (Seller đang đóng gói)
        "shipping", // Đang giao cho shipper
        "delivered", // Khách đã nhận
        "cancelled", // Đã hủy
        "returned", // Trả hàng/Hoàn tiền
      ],
      default: "pending",
    },

    // Lý do hủy đơn (nếu có)
    cancelReason: String,

    // Mã đơn hàng thân thiện (Ví dụ: #ORD8832) - Optional
    orderCode: { type: String, unique: true },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

// Middleware tự động tạo mã đơn hàng ngắn (Optional)
// orderSchema.pre('save', function(next) {
//   if(!this.orderCode) {
//       this.orderCode = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
//   }
//   next();
// });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
