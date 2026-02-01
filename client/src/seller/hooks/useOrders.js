import { useState, useCallback, useEffect } from "react";
import { orderApi } from "../services/api";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalDocs: 0,
  });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "all",
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        status: filters.status === "all" ? undefined : filters.status,
      };

      const data = await orderApi.getAll(params);

      if (data.success) {
        setOrders(data.data || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
      setError(err.response?.data?.message || err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await orderApi.getStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const previousOrders = [...orders];

      // Optimistic update
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      const res = await orderApi.updateStatus(orderId, newStatus);

      if (res.success) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? res.data : order)),
        );
        fetchStats(); // Cập nhật lại số liệu thống kê ngay lập tức
        return { success: true, message: res.message };
      } else {
        setOrders(previousOrders);
        return { success: false, message: res.message };
      }
    } catch (err) {
      fetchOrders(); // Revert bằng cách tải lại
      const msg = err.response?.data?.message || err.message;
      return { success: false, message: msg };
    }
  };

  const changePage = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const changeStatus = (newStatus) => {
    setFilters((prev) => ({ ...prev, status: newStatus, page: 1 }));
  };

  const refreshAll = useCallback(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  return {
    orders,
    pagination,
    loading,
    error,
    filter: filters,
    stats,
    updateOrderStatus,
    changePage,
    changeStatus,
    refresh: refreshAll,
  };
};
