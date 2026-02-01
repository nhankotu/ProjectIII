import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true, // Index để load tin nhắn nhanh khi user cuộn trang
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- PHẦN NÂNG CẤP CHO E-COMMERCE ---
    // Loại tin nhắn: text thường, ảnh, hay là 1 thẻ sản phẩm/đơn hàng?
    type: {
      type: String,
      enum: ["text", "image", "product", "order"],
      default: "text",
    },
    // Nếu chat về 1 sản phẩm cụ thể (User bấm "Chat ngay" từ trang Product)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    // Nếu chat về 1 đơn hàng cụ thể
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    // ------------------------------------

    text: {
      type: String,
      trim: true,
      // Logic cũ của bạn: Bắt buộc có text nếu không có ảnh VÀ không phải gửi thẻ sản phẩm/đơn hàng
      required: function () {
        return this.images.length === 0 && !this.product && !this.order;
      },
    },

    images: [
      {
        type: String, // URL từ Cloudinary/S3
      },
    ],

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index kép: Lấy tin nhắn của hội thoại X và sắp xếp theo thời gian (Hỗ trợ Pagination)
messageSchema.index({ conversationId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
