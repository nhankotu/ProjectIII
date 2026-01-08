import { useState, useEffect, useCallback } from "react";

// Import apiClient từ thư mục shared services (đã cấu hình Interceptor & Token)
import apiClient from "../../services/apiClient";

const financialApi = {
  /**
   * Lấy dữ liệu tổng quan tài chính
   * @param {string} timeRange - Khoảng thời gian: 'day' | 'week' | 'month' | 'year'
   */
  getOverview: (timeRange = "month") => {
    // Gọi GET /api/seller/financial/overview?range=...
    return apiClient.get("/api/seller/financial/overview", {
      params: { range: timeRange },
    });
  },
};
export const useFinancialData = () => {
  const [financialData, setFinancialData] = useState(null); // Khởi tạo null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Thêm state lỗi
  const [timeRange, setTimeRange] = useState("month"); // day, week, month, year

  // Sử dụng useCallback để tối ưu hiệu năng và tránh loop
  const fetchFinancialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Gọi API thực tế
      const response = await financialApi.getOverview(timeRange);
      const resData = response.data; // Axios trả data trong object .data

      if (resData.success) {
        // 2. Cập nhật state với dữ liệu thật từ Backend
        setFinancialData(resData.data);
      } else {
        throw new Error(resData.message || "Không thể tải dữ liệu tài chính");
      }
    } catch (err) {
      console.error("Error fetching financial data:", err);
      // Lấy thông báo lỗi chuẩn từ Axios hoặc Error object
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi kết nối server";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Tự động gọi API khi timeRange thay đổi
  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  const updateTimeRange = (range) => {
    setTimeRange(range);
    // useEffect sẽ tự kích hoạt fetch lại dữ liệu
  };

  // --- SAFE GETTERS (Giúp UI không bị crash khi đang tải hoặc data null) ---

  const getFinancialStats = () => {
    // Trả về object mặc định full số 0 để UI hiển thị đẹp khi loading
    return (
      financialData?.stats || {
        revenue: 0,
        profit: 0,
        orders: 0,
        profitMargin: 0,
        conversionRate: 0,
        operatingCosts: 0,
        averageOrderValue: 0,
        refundRate: 0,
      }
    );
  };

  const getRevenueReport = () => {
    return (
      financialData?.revenueReport || {
        current: 0,
        previous: 0,
        growth: 0,
        dailyRevenue: [],
        byCategory: [],
      }
    );
  };

  const getExpenseAnalysis = () => {
    return (
      financialData?.expenses || {
        total: 0,
        cogs: 0,
        shipping: 0,
        marketing: 0,
        platformFees: 0,
        operational: 0,
        breakdown: [],
      }
    );
  };

  const getPaymentHistory = () => {
    return financialData?.payments || [];
  };

  const getProfitAnalysis = () => {
    return (
      financialData?.profitAnalysis || {
        grossProfit: 0,
        netProfit: 0,
        marginByCategory: [],
        monthlyTrend: [],
      }
    );
  };

  return {
    financialData,
    loading,
    error, // Trả về lỗi để UI hiển thị thông báo
    timeRange,
    updateTimeRange,
    getFinancialStats,
    getRevenueReport,
    getExpenseAnalysis,
    getPaymentHistory,
    getProfitAnalysis,
    refetch: fetchFinancialData,
  };
};
