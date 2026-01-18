import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("token");

  // Dùng useCallback để tránh re-render vô tận
  const fetchOrders = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/seller/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Lỗi server: ${res.status}`);

      const data = await res.json();

      if (data.success) {
        // Đảm bảo luôn gán là một mảng
        setOrders(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "Không thể tải danh sách đơn hàng");
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError(err.message);
      setOrders([]); // Reset về mảng rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = getToken();
    if (!token) return { success: false, error: "Phiên đăng nhập hết hạn" };

    try {
      // 1. Optimistic update (Cập nhật giao diện trước cho nhanh)
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId || order.id === orderId // Kiểm tra cả _id và id
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : order
        )
      );

      // 2. Gọi API Update - ⚠️ HÃY KIỂM TRA ROUTE NÀY Ở BACKEND CỦA BẠN
      // Nếu Backend là /api/seller/orders/status/:id thì sửa lại cho đúng
      const res = await fetch(`${API_BASE}/api/seller/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok)
        throw new Error(`Lỗi ${res.status}: Không tìm thấy đơn hàng`);

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      // Cập nhật lại dữ liệu chuẩn từ server
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId || order.id === orderId ? data.data : order
        )
      );

      return { success: true, data: data.data };
    } catch (err) {
      console.error("❌ Error updating status:", err);
      fetchOrders(); // Tải lại danh sách để đồng bộ nếu lỗi
      return { success: false, error: err.message };
    }
  };

  const getOrderCounts = useCallback(() => {
    const counts = {
      total: orders.length,
      pending: 0,
      confirmed: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      }
    });

    return counts;
  }, [orders]);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    getOrderCounts,
    refetch: fetchOrders,
  };
};
