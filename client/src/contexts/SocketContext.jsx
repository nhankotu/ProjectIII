import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  const userId = user?._id || user?.id;

  useEffect(() => {
    // 1. NẾU USER LOGOUT (userId = null)
    if (!userId) {
      if (socket) {
        console.log("🔌 [Socket] Ngắt kết nối do Logout");
        socket.disconnect(); // 🔥 Bắt buộc ngắt kết nối ngay
        setSocket(null);
        setOnlineUsers([]); // Xóa danh sách online cục bộ
      }
      return;
    }

    // 2. NẾU USER LOGIN -> KẾT NỐI MỚI
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      query: { userId: String(userId) },
    });

    setSocket(newSocket);

    // Lắng nghe danh sách user online từ Server trả về
    newSocket.on("get_users", (users) => {
      // users là mảng các ID: ["id1", "id2", ...]
      console.log("🟢 Danh sách Online:", users);
      setOnlineUsers(users);
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
