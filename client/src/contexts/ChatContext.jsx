import React, { createContext, useContext, useState, useEffect } from "react";
import { chatAPI } from "../customer/services/api";
import { useSocket } from "./SocketContext"; // Sử dụng context bạn đã có

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  // Lấy dữ liệu ban đầu từ API
  const fetchUnreadCount = async () => {
    try {
      const res = await chatAPI.getUserConversations();
      // Giả sử API trả về mảng conversations, mỗi item có field unreadCount
      const total = res.data.reduce(
        (acc, conv) => acc + (conv.unreadCount || 0),
        0,
      );
      setUnreadCount(total);
    } catch (err) {
      console.error("Lỗi lấy số tin nhắn:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    if (socket) {
      // Lắng nghe sự kiện tin nhắn mới từ Server
      socket.on("receive_message", (newMessage) => {
        // Tăng số thông báo lên 1
        setUnreadCount((prev) => prev + 1);
      });

      return () => socket.off("receive_message");
    }
  }, [socket]);

  return (
    <ChatContext.Provider
      value={{ unreadCount, setUnreadCount, fetchUnreadCount }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
