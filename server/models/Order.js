import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        thumbnail: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        _id: false, // 💡 Quan trọng: Giúp mua nhiều sp giống nhau không bị lỗi
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY", "MOMO", "cod", "vnpay", "momo"], // 💡 Chấp nhận cả 2 định dạng
      default: "COD",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipping",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    orderCode: { type: String, unique: true }, // Mã đơn hàng tự động
  },
  { timestamps: true }
);

// Tự động tạo mã đơn hàng trước khi lưu
orderSchema.pre("save", function (next) {
  if (!this.orderCode) {
    this.orderCode = "ORD" + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
