import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { chatAPI } from "../../customer/services/api"; // Chỉnh lại đường dẫn import cho đúng

export const useCustomerChat = () => {
  const { user } = useAuth();
  const { socket } = useSocket();

  // State
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ref để auto scroll (Tùy chọn trả về ref hoặc tự xử lý trong UI)
  const scrollRef = useRef();

  // 1. Lấy danh sách hội thoại
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await chatAPI.getUserConversations();
        setConversations(res.data || []);
      } catch (err) {
        console.error("Lỗi tải inbox:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchConversations();
  }, [user]);

  // 2. Lấy tin nhắn khi chọn Shop
  useEffect(() => {
    if (currentChat) {
      const fetchMessages = async () => {
        try {
          const res = await chatAPI.getMessages(currentChat._id);
          setMessages(res.data || []);
        } catch (err) {
          console.error("Lỗi tải tin nhắn:", err);
        }
      };
      fetchMessages();
    }
  }, [currentChat]);

  // 3. Socket Realtime
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      // Nếu đang mở đúng đoạn chat -> thêm vào list
      if (currentChat && data.conversationId === currentChat._id) {
        setMessages((prev) => [...prev, data]);
      }

      // Update lại list bên trái để đưa chat mới lên đầu
      const updateConversations = async () => {
        const res = await chatAPI.getUserConversations();
        setConversations(res.data || []);
      };
      updateConversations();
    };

    socket.on("getMessage", handleReceiveMessage);
    return () => socket.off("getMessage", handleReceiveMessage);
  }, [socket, currentChat]);

  // 4. Hàm gửi tin nhắn
  const sendMessage = async (text, files = [], attachedProduct = null) => {
    if (!currentChat) return;
    if (!text?.trim() && files.length === 0 && !attachedProduct) return;

    try {
      // 🔥 QUAN TRỌNG: Phải dùng FormData để gửi File nhị phân
      const formData = new FormData();
      formData.append("conversationId", currentChat._id);
      if (text?.trim()) formData.append("text", text);
      if (attachedProduct) {
        formData.append("productId", attachedProduct._id);
        formData.append("type", "product");
      }

      // Đưa các file vào key "images" để Backend (Multer) bắt được
      files.forEach((file) => {
        formData.append("images", file);
      });

      // Gọi API gửi tin nhắn (Data bây giờ là FormData)
      const res = await chatAPI.sendMessage(formData);
      const savedMsg = res.data;

      // Bắn Socket Realtime (Sử dụng URL ảnh thật đã upload thành công)
      const receiver = currentChat.members.find(
        (m) => String(m._id || m) !== String(user._id),
      );
      socket.emit("sendMessage", {
        senderId: user._id,
        receiverId: receiver?._id || receiver,
        ...savedMsg,
      });

      // Cập nhật UI
      setMessages((prev) => [...prev, savedMsg]);

      // Cập nhật danh sách hội thoại bên trái (Optional)
      // ... logic cập nhật conversations ...
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

  return {
    conversations,
    currentChat,
    messages,
    loading,
    setCurrentChat,
    sendMessage,
    user,
  };
};
