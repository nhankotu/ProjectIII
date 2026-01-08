import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/api";

export const useAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    productBreakdown: { active: 0, pending: 0, rejected: 0, hidden: 0 },
    ordersToday: 0,
    revenueMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Gọi song song 2 API
      const [productRes, userRes] = await Promise.all([
        apiClient.get("/api/admin/products/stats"),
        apiClient.get("/api/admin/users?limit=1"),
      ]);

      // --- DEBUG: Mở F12 xem tab Console có hiện dòng này không ---
      console.log("Product Data:", productRes.data);
      console.log("User Data:", userRes.data);
      // ----------------------------------------------------------

      setStats((prev) => ({
        ...prev,
        // Dùng optional chaining (?.) để tránh lỗi nếu API chưa trả về kịp
        totalProducts: productRes.data.stats?.total || 0,
        productBreakdown: productRes.data.stats || {
          active: 0,
          pending: 0,
          rejected: 0,
          hidden: 0,
        },
        totalUsers: userRes.data.pagination?.total || 0,
      }));
    } catch (error) {
      console.error("Lỗi tải dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, loading, refresh: fetchDashboardData };
};
