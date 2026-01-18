const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        // Thường sẽ chứa [UserId_Khach, UserId_Shop]
      },
    ],
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      seen: {
        type: Boolean,
        default: false,
      },
      createdAt: Date,
    },
    // Trường này giúp sắp xếp danh sách chat theo tin nhắn mới nhất
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

// Index để tìm nhanh các cuộc hội thoại của một user cụ thể
conversationSchema.index({ members: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
