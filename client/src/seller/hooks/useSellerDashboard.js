// src/hooks/useSellerDashboard.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Utility functions
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

  // Function to get auth token
  const getAuthToken = () => {
    return (
      localStorage.getItem("token") || sessionStorage.getItem("token") || ""
    );
  };

  // Function to handle API errors
  const handleApiError = (error, statusCode) => {
    console.error("API Error:", error);

    if (statusCode === 401) {
      // Clear invalid token
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
      return "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
    }

    if (statusCode === 403) {
      return "Bạn không có quyền truy cập trang này.";
    }

    if (statusCode === 404) {
      return "API endpoint không tồn tại.";
    }

    if (statusCode >= 500) {
      return "Lỗi máy chủ. Vui lòng thử lại sau.";
    }

    return error.message || "Có lỗi xảy ra khi tải dữ liệu.";
  };

  // Fetch dashboard data từ API
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        navigate("/login");
        return;
      }

      // Gọi API thực sự
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/seller/dashboard/summary`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Kiểm tra response
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || `HTTP ${response.status}` };
        }

        const errorMessage = handleApiError(
          new Error(errorData.message || `Lỗi ${response.status}`),
          response.status
        );
        setError(errorMessage);
        return;
      }

      const data = await response.json();
      console.log("API Data received:", data);

      // Validate và format dữ liệu theo đúng cấu trúc API trả về
      if (!data || typeof data !== "object") {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      // API trả về: { stats, recentOrders, topProducts }
      if (
        data.stats &&
        Array.isArray(data.recentOrders) &&
        Array.isArray(data.topProducts)
      ) {
        // Format dữ liệu theo đúng cấu trúc API
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
          topProducts: data.topProducts.map((product) => ({
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
        // Nếu cấu trúc khác, có thể API đang có vấn đề
        throw new Error("Cấu trúc dữ liệu không đúng định dạng");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message || "Có lỗi xảy ra khi tải dữ liệu");

      // KHÔNG DÙNG MOCK DATA - chỉ hiển thị lỗi
      setDashboardData({
        todayRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        totalProducts: 0,
        conversionRate: 0,
        recentOrders: [],
        topProducts: [],
      });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch data khi component mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Hàm xử lý Quick Actions
  const handleQuickAction = (action) => {
    const actionMap = {
      "add-product": "/seller/products/add",
      "process-orders": "/seller/orders",
      "view-reports": "/seller/reports",
      "create-promotion": "/seller/promotions/create",
    };

    if (actionMap[action]) {
      navigate(actionMap[action]);
    }
  };

  return {
    // State
    dashboardData,
    loading,
    error,

    // Methods
    refetch: fetchDashboardData,
    formatCurrency,
    formatStatus,
    handleQuickAction,
  };
};
