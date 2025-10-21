import React, { useState } from "react";
import { useFinancialData } from "../hooks/useFinancialData";
import FinancialStats from "../components/financial/FinancialStats";
import RevenueChart from "../components/financial/RevenueChart";
import ExpenseBreakdown from "../components/financial/ExpenseBreakdown";
import PaymentHistory from "../components/financial/PaymentHistory";

const FinancialManagement = () => {
  const {
    loading,
    timeRange,
    updateTimeRange,
    getFinancialStats,
    getRevenueReport,
    getExpenseAnalysis,
    getPaymentHistory,
    refetch,
  } = useFinancialData();

  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải dữ liệu tài chính...</div>
      </div>
    );
  }

  const stats = getFinancialStats();
  const revenueReport = getRevenueReport();
  const expenseAnalysis = getExpenseAnalysis();
  const paymentHistory = getPaymentHistory();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Tài Chính</h1>
        <p className="text-gray-600">
          Theo dõi doanh thu, chi phí và lợi nhuận
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {["day", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => updateTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  timeRange === range
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {range === "day" && "Hôm nay"}
                {range === "week" && "Tuần này"}
                {range === "month" && "Tháng này"}
                {range === "year" && "Năm nay"}
              </button>
            ))}
          </div>
          <button
            onClick={refetch}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* Financial Stats */}
        <FinancialStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <RevenueChart revenueReport={revenueReport} />

          {/* Expense Breakdown */}
          <ExpenseBreakdown expenses={expenseAnalysis} />
        </div>

        {/* Payment History */}
        <PaymentHistory payments={paymentHistory} />
      </div>
    </div>
  );
};

export default FinancialManagement;
