import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    thumbnail: { type: String },
    sku: { type: String },
    attributes: { type: Map, of: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [orderItemSchema],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
      detailAddress: { type: String, required: true },
    },

    // Tài chính
    itemsPrice: { type: Number, required: true }, // Tổng tiền hàng gốc
    shippingPrice: { type: Number, required: true },

    // Lưu vết các mã giảm giá đã áp dụng
    discounts: [
      {
        voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
        code: String,
        amount: { type: Number, default: 0 },
        ownerType: { type: String, enum: ["shop", "platform"] }, // Ai chi trả khoản này?
      },
    ],

    totalDiscount: { type: Number, default: 0 }, // Tổng tiền được giảm
    totalAmount: { type: Number, required: true }, // Khách thực trả (= itemsPrice + ship - totalDiscount)

    shippingProvider: { type: String, default: null },
    trackingCode: { type: String, default: null },

    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY", "MOMO"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
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

    note: { type: String },
    orderCode: { type: String, unique: true },
  },
  { timestamps: true },
);

// Tự động tính toán tổng tiền và mã hóa Payment Method
orderSchema.pre("save", function (next) {
  if (!this.orderCode) {
    this.orderCode = "ORD" + Date.now() + Math.floor(Math.random() * 1000);
  }

  if (this.paymentMethod) this.paymentMethod = this.paymentMethod.toUpperCase();

  // Logic tính toán tiền tệ
  this.totalDiscount = this.discounts.reduce((sum, d) => sum + d.amount, 0);
  this.totalAmount = Math.max(
    0,
    this.itemsPrice + this.shippingPrice - this.totalDiscount,
  );

  next();
});

export default mongoose.model("Order", orderSchema);
