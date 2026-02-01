import { useState, useEffect } from "react";
import { chatApi } from "../services/api";
import { useSocket } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";

export const useSellerChat = () => {
  const { user } = useAuth();
  const { socket } = useSocket();

  // State
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // =========================================================
  // 1. LẤY DANH SÁCH HỘI THOẠI
  // =========================================================
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // Gọi từ chatApi
        const res = await chatApi.getConversations();
        setConversations(res.data.data || []);
      } catch (err) {
        console.error("Lỗi tải hội thoại:", err);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchConversations();
  }, [user]);

  // =========================================================
  // 2. LẤY TIN NHẮN CỦA 1 KHÁCH HÀNG
  // =========================================================
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;
      try {
        // Gọi từ chatApi
        const res = await chatApi.getMessages(currentChat._id);
        setMessages(res.data.data || []);

        // Gọi markAsRead (Logic tách ra hàm dưới)
        markAsRead(currentChat._id);
      } catch (err) {
        console.error("Lỗi tải tin nhắn:", err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [currentChat]);

  // =========================================================
  // 3. SOCKET: LẮNG NGHE TIN NHẮN ĐẾN (GIỮ NGUYÊN)
  // =========================================================
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      // 3.1. Nếu đang mở đúng chat đó -> Thêm tin nhắn vào list hiển thị
      if (currentChat && currentChat._id === data.conversationId) {
        setMessages((prev) => [...prev, data]);
        markAsRead(data.conversationId);
      }

      // 3.2. Cập nhật tin nhắn cuối cùng ở cột bên trái
      setConversations((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const targetChat = safePrev.find((c) => c._id === data.conversationId);
        const otherChats = safePrev.filter(
          (c) => c._id !== data.conversationId,
        );

        if (targetChat) {
          let previewText = data.text;
          if (
            data.type === "image" ||
            (data.images && data.images.length > 0)
          ) {
            previewText = "[Hình ảnh]";
          } else if (data.type === "product") {
            previewText = "[Sản phẩm]";
          }

          const updatedChat = {
            ...targetChat,
            lastMessage: {
              text: previewText || "Tin nhắn mới",
              sender: data.senderId,
              createdAt: new Date().toISOString(),
              isSeen: false,
            },
          };
          return [updatedChat, ...otherChats];
        }
        return safePrev;
      });
    };

    socket.on("getMessage", handleMessage);
    return () => {
      socket.off("getMessage", handleMessage);
    };
  }, [socket, currentChat]);

  // =========================================================
  // 4. GỬI TIN NHẮN (Đã cập nhật dùng chatApi)
  // =========================================================

  const sendMessage = async (text, files = [], extraData = {}) => {
    // Validate cơ bản
    if (
      !currentChat ||
      (!text?.trim() && files.length === 0 && !extraData.productId)
    )
      return;

    try {
      setSending(true);
      const receiver = currentChat.members.find((m) => m._id !== user._id);

      // Gọi API từ chatApi (FormData được build bên trong hàm này)
      const res = await chatApi.sendMessage(
        currentChat._id,
        text,
        files,
        extraData.productId,
      );

      const savedMsg = res.data.data;

      // Gửi Socket (Logic giữ nguyên)
      socket.emit("sendMessage", {
        senderId: user._id,
        receiverId: receiver?._id,
        conversationId: currentChat._id,
        text: savedMsg.text,
        images: savedMsg.images,
        type: savedMsg.type,
        productId: savedMsg.product?._id,
      });

      // Cập nhật UI Messages
      setMessages((prev) => [...prev, savedMsg]);

      // Cập nhật danh sách Conversations bên trái
      setConversations((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const otherChats = safePrev.filter((c) => c._id !== currentChat._id);

        const updatedChat = {
          ...currentChat,
          lastMessage: {
            text:
              savedMsg.type === "image"
                ? "[Hình ảnh]"
                : savedMsg.text || "Tin nhắn mới",
            sender: user._id,
            createdAt: new Date().toISOString(),
            isSeen: false,
          },
        };
        return [updatedChat, ...otherChats];
      });

      return res.data;
    } catch (err) {
      console.error("Gửi tin thất bại:", err);
      throw err;
    } finally {
      setSending(false);
    }
  };

  // =========================================================
  // 5. ĐÁNH DẤU ĐÃ ĐỌC (Đã cập nhật dùng chatApi)
  // =========================================================
  const markAsRead = async (conversationId) => {
    try {
      // Gọi từ chatApi
      await chatApi.markAsRead(conversationId);

      setConversations((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.map((c) => {
          if (c._id === conversationId && c.lastMessage) {
            return { ...c, lastMessage: { ...c.lastMessage, isSeen: true } };
          }
          return c;
        });
      });
    } catch (err) {
      console.error("Lỗi mark read:", err);
    }
  };

  return {
    conversations,
    currentChat,
    messages,
    loading,
    sending,
    setCurrentChat,
    sendMessage,
    user: user || {},
  };
};
