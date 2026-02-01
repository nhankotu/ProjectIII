import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardApi } from "../services/api";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatStatus = (status) => {
  const statusMap = {
    pending: { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
    processing: { text: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
    shipping: { text: "Đang giao", color: "bg-purple-100 text-purple-800" },
    completed: { text: "Hoàn thành", color: "bg-green-100 text-green-800" },
    delivered: { text: "Đã giao", color: "bg-green-100 text-green-800" },
    cancelled: { text: "Đã hủy", color: "bg-red-100 text-red-800" },
  };
  return (
    statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" }
  );
};

export const useSellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todayRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalProducts: 0,
    conversionRate: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleApiError = (error, statusCode) => {
    if (statusCode === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
      return "Phiên đăng nhập hết hạn.";
    }
    return error.message || "Có lỗi xảy ra khi tải dữ liệu.";
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getSummary();

      if (!response) {
        throw new Error("Không nhận được phản hồi từ server");
      }

      let data = null;
      if (response.data && response.data.stats) {
        data = response.data;
      } else if (response.stats) {
        data = response;
      } else {
        data = response.data || response;
      }

      if (!data || typeof data !== "object") {
        throw new Error("Dữ liệu sau trích xuất không hợp lệ");
      }

      if (data.stats && Array.isArray(data.recentOrders)) {
        const formattedData = {
          todayRevenue: data.stats.todayRevenue || 0,
          totalOrders: data.stats.totalOrders || 0,
          pendingOrders: data.stats.pendingOrders || 0,
          lowStockProducts: data.stats.lowStockProducts || 0,
          totalProducts: data.stats.totalProducts || 0,
          conversionRate: data.stats.conversionRate || 0,
          recentOrders: data.recentOrders.map((order) => ({
            id: order.id || order._id,
            customer: order.customer || "Khách hàng",
            amount: order.amount || order.total || 0,
            status: order.status || "pending",
            date: order.date || new Date().toISOString().split("T")[0],
            itemsCount: order.itemsCount || 0,
          })),
          topProducts: (data.topProducts || []).map((product) => ({
            id: product.id || product._id,
            name: product.name || "Sản phẩm",
            sales: product.sales || product.soldCount || 0,
            revenue:
              product.revenue ||
              (product.price || 0) * (product.sales || product.soldCount || 0),
            price: product.price || 0,
            stock: product.stock || 0,
            image: product.image || product.images?.[0]?.url || null,
          })),
        };

        setDashboardData(formattedData);
      } else {
        throw new Error("Cấu trúc dữ liệu không đúng định dạng");
      }
    } catch (err) {
      const errorMessage = handleApiError(err, err.response?.status);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleQuickAction = (action) => {
    const actionMap = {
      "add-product": "/seller/products/add",
      "process-orders": "/seller/orders",
      "view-reports": "/seller/reports",
      "create-promotion": "/seller/promotions/create",
    };
    if (actionMap[action]) navigate(actionMap[action]);
  };

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboardData,
    formatCurrency,
    formatStatus,
    handleQuickAction,
  };
};
