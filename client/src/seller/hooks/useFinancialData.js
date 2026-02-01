import { useState, useEffect, useCallback, useMemo } from "react";
import { financialApi } from "../services/api";

export const useFinancialData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await financialApi.getOverview(timeRange);
      if (res.success) {
        setData(res.data);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 1. Stats: Thêm đủ các trường để không bị undefined
  const stats = useMemo(
    () =>
      data?.stats || {
        revenue: 0,
        profit: 0,
        orders: 0,
        profitMargin: 0,
        operatingCosts: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        refundRate: 0,
      },
    [data],
  );

  // 2. Revenue Report
  const revenueReport = useMemo(
    () =>
      data?.revenueReport || {
        current: 0,
        growth: 0,
        dailyRevenue: [],
        byCategory: [],
      },
    [data],
  );

  // 3. Expenses: QUAN TRỌNG - Thêm default cho cogs, marketing... để UI không bị NaN
  const expenses = useMemo(
    () =>
      data?.expenses || {
        total: 0,
        cogs: 0,
        marketing: 0,
        shipping: 0,
        platformFees: 0,
        breakdown: [],
      },
    [data],
  );

  // 4. Payments
  const payments = useMemo(() => data?.payments || [], [data]);

  return {
    loading,
    error,
    timeRange,
    updateTimeRange: setTimeRange,
    refetch: fetchData,
    stats,
    revenueReport,
    expenses,
    payments,
  };
};
