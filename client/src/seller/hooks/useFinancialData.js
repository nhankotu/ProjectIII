import { useState, useEffect } from "react";

export const useFinancialData = () => {
  const [financialData, setFinancialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // day, week, month, year

  useEffect(() => {
    fetchFinancialData();
  }, [timeRange]);

  const fetchFinancialData = async () => {
    try {
      // Mock data - financial metrics
      const mockData = {
        // Dashboard Stats
        stats: {
          revenue: 125000000,
          profit: 45000000,
          orders: 156,
          profitMargin: 36,
          conversionRate: 3.2,
          operatingCosts: 15000000,
          averageOrderValue: 801282,
          refundRate: 2.1,
        },

        // Revenue Report
        revenueReport: {
          current: 125000000,
          previous: 98000000,
          growth: 27.6,
          dailyRevenue: [
            { date: "10-01", revenue: 4200000 },
            { date: "10-02", revenue: 3800000 },
            { date: "10-03", revenue: 5100000 },
            { date: "10-04", revenue: 4700000 },
            { date: "10-05", revenue: 3900000 },
            { date: "10-06", revenue: 4500000 },
            { date: "10-07", revenue: 5200000 },
          ],
          byCategory: [
            { category: "Thời trang", revenue: 65000000, percentage: 52 },
            { category: "Giày dép", revenue: 35000000, percentage: 28 },
            { category: "Phụ kiện", revenue: 25000000, percentage: 20 },
          ],
        },

        // Expense Analysis
        expenses: {
          total: 80000000,
          cogs: 55000000, // Cost of Goods Sold
          shipping: 12000000,
          marketing: 8000000,
          platformFees: 3500000,
          operational: 1500000,
          breakdown: [
            { category: "Giá vốn", amount: 55000000, percentage: 68.75 },
            { category: "Vận chuyển", amount: 12000000, percentage: 15 },
            { category: "Marketing", amount: 8000000, percentage: 10 },
            { category: "Phí sàn", amount: 3500000, percentage: 4.38 },
            { category: "Vận hành", amount: 1500000, percentage: 1.87 },
          ],
        },

        // Payment History
        payments: [
          {
            id: "PMT-001",
            orderId: "ORD-001",
            customer: "Nguyễn Văn A",
            amount: 650000,
            method: "momo",
            status: "completed",
            date: "2024-10-07 14:30",
            fee: 19500,
          },
          {
            id: "PMT-002",
            orderId: "ORD-002",
            customer: "Trần Thị B",
            amount: 420000,
            method: "cod",
            status: "pending",
            date: "2024-10-07 13:15",
            fee: 0,
          },
          {
            id: "PMT-003",
            orderId: "ORD-003",
            customer: "Lê Văn C",
            amount: 780000,
            method: "banking",
            status: "completed",
            date: "2024-10-06 16:45",
            fee: 23400,
          },
          {
            id: "PMT-004",
            orderId: "ORD-004",
            customer: "Phạm Thị D",
            amount: 320000,
            method: "momo",
            status: "completed",
            date: "2024-10-06 11:20",
            fee: 9600,
          },
          {
            id: "PMT-005",
            orderId: "ORD-005",
            customer: "Hoàng Văn E",
            amount: 540000,
            method: "cod",
            status: "cancelled",
            date: "2024-10-05 09:30",
            fee: 0,
          },
        ],

        // Profit Analysis
        profitAnalysis: {
          grossProfit: 70000000,
          netProfit: 45000000,
          marginByCategory: [
            {
              category: "Thời trang",
              margin: 42,
              revenue: 65000000,
              profit: 27300000,
            },
            {
              category: "Giày dép",
              margin: 35,
              revenue: 35000000,
              profit: 12250000,
            },
            {
              category: "Phụ kiện",
              margin: 28,
              revenue: 25000000,
              profit: 7000000,
            },
          ],
          monthlyTrend: [
            { month: "T6", revenue: 89000000, profit: 32000000 },
            { month: "T7", revenue: 95000000, profit: 35000000 },
            { month: "T8", revenue: 110000000, profit: 40000000 },
            { month: "T9", revenue: 98000000, profit: 36000000 },
            { month: "T10", revenue: 125000000, profit: 45000000 },
          ],
        },
      };

      setFinancialData(mockData);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeRange = (range) => {
    setTimeRange(range);
    setLoading(true);
  };

  const getFinancialStats = () => {
    return financialData.stats || {};
  };

  const getRevenueReport = () => {
    return financialData.revenueReport || {};
  };

  const getExpenseAnalysis = () => {
    return financialData.expenses || {};
  };

  const getPaymentHistory = () => {
    return financialData.payments || [];
  };

  const getProfitAnalysis = () => {
    return financialData.profitAnalysis || {};
  };

  return {
    financialData,
    loading,
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
