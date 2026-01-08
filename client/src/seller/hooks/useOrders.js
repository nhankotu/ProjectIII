import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export const useOrders = () => {
  // ⚠️ Bỏ tham số sellerId vì ta sẽ lấy từ Token
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Helper lấy token an toàn
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ✅ Fetch orders từ API Seller (Đã sửa)
  const fetchOrders = async () => {
    const token = getToken();

    // Nếu không có token (chưa đăng nhập), dừng lại
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 🛠️ SỬA ĐỔI QUAN TRỌNG TẠI ĐÂY:
      // 1. URL: Trỏ về /api/seller/orders
      // 2. Headers: Gửi kèm Token
      const res = await fetch(`${API_BASE}/api/seller/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token để Backend biết Seller là ai
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetch khi component mount
  useEffect(() => {
    fetchOrders();
  }, []); // Không cần phụ thuộc sellerId nữa

  // ✅ Cập nhật trạng thái đơn hàng (Cũng cần thêm Token)
  const updateOrderStatus = async (orderId, newStatus) => {
    const token = getToken();
    if (!token) return { success: false, error: "No token found" };

    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : order
        )
      );

      // Gọi API Update (Thường route này cũng cần bảo vệ bằng Token)
      // Lưu ý: Kiểm tra lại route backend cập nhật đơn hàng của bạn là gì.
      // Thường là PUT /api/seller/orders/:id hoặc PUT /api/orders/:id
      // Ở đây tôi giả định bạn dùng route chung /api/orders/:id nhưng thêm Token
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 Thêm Token vào đây luôn
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update order");
      }

      // Cập nhật lại data chuẩn từ server
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? data.data : order))
      );

      return { success: true, data: data.data };
    } catch (err) {
      console.error("❌ Error updating order status:", err);

      // Revert nếu lỗi
      setOrders((prev) => fetchOrders()); // Fetch lại cho chắc ăn
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ✅ Lọc orders theo status
  const getOrdersByStatus = (status) => {
    if (status === "all") return orders;
    return orders.filter((order) => order.status === status);
  };

  // ✅ Tính toán số lượng orders
  const getOrderCounts = () => {
    const counts = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });

    return counts;
  };

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    getOrdersByStatus,
    getOrderCounts,
    refetch: fetchOrders,
  };
};
