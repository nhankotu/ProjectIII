import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Lưu cache tin nhắn cuối cùng để hiển thị ở danh sách bên trái (Inbox)
    // Giúp không phải query vào collection Message khi chỉ load danh sách chat
    lastMessage: {
      text: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isSeen: {
        type: Boolean,
        default: false,
      },
      createdAt: { type: Date, default: Date.now },
    },

    // --- BỔ SUNG QUAN TRỌNG CHO TMĐT ---

    // Đếm số tin nhắn chưa đọc cho từng user (Tùy chọn nâng cao)
    // VD: { "userId_A": 0, "userId_B": 2 } -> User B thấy hiện số 2 đỏ
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },

    // Trạng thái cuộc hội thoại (Active, Blocked...)
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt (ngày bắt đầu chat), updatedAt (ngày chat gần nhất)
  }
);

// --- TỐI ƯU INDEX ---
// 1. Tìm các cuộc hội thoại của User X và sắp xếp theo tin mới nhất (CỰC KỲ QUAN TRỌNG)
// Compound Index: Tìm theo members trước, sau đó sort theo updatedAt
conversationSchema.index({ members: 1, updatedAt: -1 });

export default mongoose.model("Conversation", conversationSchema);
