import React from "react";
import { useFinancialData } from "../hooks/useFinancialData";
import FinancialStats from "../components/financial/FinancialStats";
import RevenueChart from "../components/financial/RevenueChart";
import ExpenseBreakdown from "../components/financial/ExpenseBreakdown";
import PaymentHistory from "../components/financial/PaymentHistory";
import { RefreshCcw, AlertCircle } from "lucide-react"; // Import Icon

// Component Loading & Error nhỏ gọn
const LoadingSpinner = () => (
  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
);

const FinancialManagement = () => {
  const {
    loading,
    error,
    timeRange,
    updateTimeRange,
    refetch,
    stats,
    revenueReport,
    expenses,
    payments,
  } = useFinancialData();

  // Danh sách Filter thời gian
  const timeFilters = [
    { id: "day", label: "Hôm nay" },
    { id: "week", label: "Tuần này" },
    { id: "month", label: "Tháng này" },
    { id: "year", label: "Năm nay" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-gray-50">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500">Đang tổng hợp số liệu tài chính...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-red-50 p-6 rounded-lg m-6">
        <AlertCircle size={48} className="text-red-500 mb-3" />
        <h3 className="text-red-700 text-lg font-bold">
          Không thể tải dữ liệu
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
        >
          Thử lại ngay
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Quản Lý Tài Chính
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Báo cáo chi tiết doanh thu, lợi nhuận và dòng tiền
          </p>
        </div>

        {/* TIME RANGE FILTER & REFRESH */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
          {timeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => updateTimeRange(filter.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeRange === filter.id
                  ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          <button
            onClick={refetch}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* DASHBOARD CONTENT */}
      <div className="space-y-6">
        {/* 1. Các thẻ thống kê (Stats Cards) */}
        <FinancialStats stats={stats} />

        {/* 2. Biểu đồ & Phân tích chi phí (Grid 2 cột) */}
        {/* 🔥 Đã xóa thẻ div bao ngoài dư thừa vì Component con đã tự style card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <RevenueChart revenueReport={revenueReport} />
          <ExpenseBreakdown expenses={expenses} />
        </div>

        {/* 3. Lịch sử thanh toán */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">
              Lịch sử dòng tiền
            </h3>
          </div>
          <PaymentHistory payments={payments} />
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
