import Conversation from "../../models/Conversation.js";
import Message from "../../models/Message.js";
import User from "../../models/User.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/productService.js";
// ============================================================================
// 1. LẤY DANH SÁCH KHÁCH HÀNG ĐÃ NHẮN TIN (Inbox của Shop)
// ============================================================================
export const getSellerConversations = async (req, res) => {
  try {
    // Đây chính là ID của User đang đóng vai trò Seller
    const sellerId = req.user._id;

    const conversations = await Conversation.find({
      members: { $in: [sellerId] },
    })
      // Populate thông tin User trong mảng members.
      // Frontend sẽ lọc: Member nào có _id != sellerId thì đó là Khách Hàng.
      .populate("members", "username avatar email role")
      .sort({ updatedAt: -1 }); // Tin mới nhất lên đầu

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 2. SHOP TRẢ LỜI TIN NHẮN
// ============================================================================

export const sendReply = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { conversationId, text, productId } = req.body;
    let { type } = req.body;

    let images = [];
    if (req.files?.images) {
      const uploadPromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer, "chat/images", "image"),
      );
      const results = await Promise.all(uploadPromises);

      // 🔥 SỬA TẠI ĐÂY:
      // Vì results trả về mảng các Object [{url, public_id}, ...]
      // Chúng ta chỉ lấy cái 'url' (là string) để lưu vào DB
      images = results
        .filter((result) => result !== null)
        .map((result) => (typeof result === "string" ? result : result.url));

      if (images.length > 0) type = "image";
    }

    // Tương tự cho Video nếu có
    if (req.files?.videos && req.files.videos.length > 0) {
      const videoResult = await uploadToCloudinary(
        req.files.videos[0].buffer,
        "chat/videos",
        "video",
      );
      if (videoResult) {
        // Lấy .url nếu là Object, còn không thì lấy chính nó
        const videoUrl =
          typeof videoResult === "string" ? videoResult : videoResult.url;
        images.push(videoUrl);
        type = "video";
      }
    }

    // BƯỚC LƯU DATABASE (Giữ nguyên)
    const newMessage = new Message({
      conversationId,
      sender: sellerId,
      text: text || "",
      images: images, // Bây giờ toàn bộ là mảng String URL xịn
      type: type || "text",
      product: productId || null,
      isRead: false,
    });

    const savedMessage = await newMessage.save();

    // 4. CẬP NHẬT CONVERSATION (Tin nhắn cuối cùng)
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text:
          type === "image"
            ? "Shop đã gửi ảnh"
            : type === "video"
              ? "Shop đã gửi video"
              : text,
        sender: sellerId,
        isSeen: false,
        createdAt: new Date(),
      },
    });

    // 5. TRẢ VỀ DỮ LIỆU ĐÃ POPULATE
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("sender", "username avatar")
      .populate("product", "name thumbnail price slug");

    res.status(200).json({ success: true, data: populatedMessage });
  } catch (error) {
    console.error("❌ Send Reply Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 3. LẤY CHI TIẾT TIN NHẮN VỚI 1 KHÁCH HÀNG
// ============================================================================
export const getSellerMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // (Optional) Bảo mật: Check xem sellerId có nằm trong conversation này không
    // const checkConv = await Conversation.findOne({ _id: conversationId, members: req.user._id });
    // if(!checkConv) return res.status(403).json(...)

    const messages = await Message.find({ conversationId })
      .populate("sender", "username avatar role")
      .populate("product", "name thumbnail price slug")
      .populate("order", "totalAmount status code") // Nếu có tính năng gửi đơn hàng
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 4. ĐÁNH DẤU ĐÃ ĐỌC (Quan trọng cho Seller)
// ============================================================================
// Khi Shop bấm vào chat với khách A, gọi API này để xóa badge thông báo
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const sellerId = req.user._id;

    // Cập nhật tất cả tin nhắn mà NGƯỜI GỬI KHÔNG PHẢI LÀ SHOP -> thành đã đọc
    await Message.updateMany(
      { conversationId, sender: { $ne: sellerId }, isRead: false },
      { $set: { isRead: true } },
    );

    // Cập nhật trạng thái lastMessage trong Conversation (để list bên trái không bôi đậm nữa)
    // Chỉ update nếu tin nhắn cuối là do Khách gửi
    const conversation = await Conversation.findById(conversationId);
    if (
      conversation &&
      conversation.lastMessage.sender.toString() !== sellerId.toString()
    ) {
      await Conversation.findByIdAndUpdate(conversationId, {
        "lastMessage.isSeen": true,
      });
    }

    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
