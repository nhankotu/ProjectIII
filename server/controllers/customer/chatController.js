import Conversation from "../../models/Conversation.js";
import Message from "../../models/Message.js";
import User from "../../models/User.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/productService.js";
// 1. TẠO HOẶC LẤY HỘI THOẠI (Khi bấm nút "Chat Ngay")
export const createOrGetConversation = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body; // ID của Shop/Người bán
    console.log(req.body);
    // Tìm xem đã có hội thoại giữa 2 người chưa
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    // Nếu chưa có -> Tạo mới
    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId],
        lastMessage: {
          text: "Bắt đầu cuộc trò chuyện",
          sender: senderId,
          createdAt: new Date(),
        },
      });
      await conversation.save();
    }

    // Populate thông tin người kia để hiển thị tên/avatar
    const fullConversation = await Conversation.findById(conversation._id)
      .populate("members", "name avatar role") // Lấy tên, avatar
      .populate("lastMessage.sender", "name");

    res.status(200).json({ success: true, data: fullConversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. LẤY DANH SÁCH HỘI THOẠI (Inbox bên trái)
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      members: { $in: [userId] },
    })
      .populate("members", "name avatar role") // Để hiển thị avatar người chat cùng
      .sort({ updatedAt: -1 }); // Tin mới nhất lên đầu

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GỬI TIN NHẮN (Lưu DB + Update Conversation)
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    // Lấy dữ liệu text từ req.body
    const { conversationId, text, productId, orderId } = req.body;
    let { type } = req.body;

    // 🔥 XỬ LÝ FILE TỪ MIDDLEWARE (Giống phía Shop)
    let images = [];
    if (req.files) {
      // 1. Xử lý Ảnh
      if (req.files.images) {
        const uploadPromises = req.files.images.map((file) =>
          uploadToCloudinary(file.buffer, "chat/customer/images", "image"),
        );
        const results = await Promise.all(uploadPromises);
        // Trích xuất URL từ kết quả (Object {url, public_id})
        const imageUrls = results
          .filter((res) => res !== null)
          .map((res) => (typeof res === "string" ? res : res.url));
        images = [...images, ...imageUrls];
        if (imageUrls.length > 0) type = "image";
      }

      // 2. Xử lý Video
      if (req.files.videos && req.files.videos.length > 0) {
        const videoResult = await uploadToCloudinary(
          req.files.videos[0].buffer,
          "chat/customer/videos",
          "video",
        );
        if (videoResult) {
          const videoUrl =
            typeof videoResult === "string" ? videoResult : videoResult.url;
          images.push(videoUrl);
          type = "video";
        }
      }
    }

    // A. Tạo tin nhắn mới
    const newMessage = new Message({
      conversationId,
      sender: senderId,
      text: text || "",
      images: images,
      type: type || "text",
      product: productId || null,
      order: orderId || null,
      isRead: false,
    });

    const savedMessage = await newMessage.save();

    // B. Cập nhật "lastMessage" cho Conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text:
          type === "image"
            ? "Đã gửi một ảnh"
            : type === "video"
              ? "Đã gửi một video"
              : type === "product"
                ? "Đã gửi thẻ sản phẩm"
                : text,
        sender: senderId,
        isSeen: false,
        createdAt: new Date(),
      },
    });

    // Populate dữ liệu để trả về UI
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("sender", "name avatar")
      .populate("product", "name thumbnail price slug")
      .populate("order", "totalAmount status");

    res.status(200).json({ success: true, data: populatedMessage });
  } catch (error) {
    console.error("❌ Customer SendMessage Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. LẤY LỊCH SỬ TIN NHẮN (Khi click vào 1 hội thoại)
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("sender", "name avatar")
      .populate("product", "name thumbnail price slug")
      .populate("order", "totalAmount status")
      .sort({ createdAt: 1 }); // Cũ nhất ở trên, mới nhất ở dưới

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
