const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      // Người nhận thông báo
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      // Người gửi (có thể là System hoặc Admin/Shop)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["ORDER", "PROMOTION", "SYSTEM", "CHAT"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Ảnh minh họa (ví dụ ảnh sản phẩm)
    },
    link: {
      // Đường dẫn khi click vào (ví dụ: /order/123)
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index để load nhanh danh sách thông báo của 1 người
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
