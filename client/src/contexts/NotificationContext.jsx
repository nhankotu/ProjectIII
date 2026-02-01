import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [orderNotiCount, setOrderNotiCount] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("order_status_updated", (data) => {
        setOrderNotiCount((prev) => prev + 1);

        alert(
          `Thông báo: Đơn hàng #${data.orderId.slice(-8)} đã ${data.status}`,
        );
      });

      return () => socket.off("order_status_updated");
    }
  }, [socket]);

  return (
    <NotificationContext.Provider value={{ orderNotiCount, setOrderNotiCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
