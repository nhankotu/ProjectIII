import React from "react";
import { TrendingDown, AlertCircle } from "lucide-react";

const ExpenseBreakdown = ({ expenses }) => {
  // 1. Format tiền: Rút gọn cho Overview, Đầy đủ cho chi tiết
  const formatCurrency = (amount, compact = false) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: compact ? "compact" : "standard",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  // 2. Map màu sắc theo loại chi phí (Cố định để nhất quán)
  const getCategoryColor = (categoryKey) => {
    const colorMap = {
      cogs: "bg-red-500", // Giá vốn (Quan trọng nhất)
      shipping: "bg-blue-500", // Vận chuyển
      marketing: "bg-purple-500", // Marketing
      platformFees: "bg-orange-500", // Phí sàn
      operational: "bg-gray-500", // Vận hành
      other: "bg-yellow-500",
    };
    return colorMap[categoryKey] || "bg-teal-500";
  };

  // 3. Xử lý trường hợp không có dữ liệu
  if (!expenses || expenses.total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col justify-center items-center text-center">
        <div className="bg-gray-100 p-3 rounded-full mb-3">
          <TrendingDown className="text-gray-400" size={24} />
        </div>
        <h3 className="text-gray-900 font-semibold">Chưa có chi phí</h3>
        <p className="text-gray-500 text-sm mt-1">
          Không có dữ liệu chi phí trong khoảng thời gian này.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Cơ cấu chi phí</h3>
          <p className="text-sm text-gray-500">Phân bổ theo danh mục</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(expenses.total, true)}{" "}
            {/* Format rút gọn: 1.2 Tỷ */}
          </p>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
            Tổng chi
          </p>
        </div>
      </div>

      {/* LIST CHI PHÍ (BREAKDOWN) */}
      <div className="space-y-5">
        {expenses.breakdown && expenses.breakdown.length > 0 ? (
          expenses.breakdown.map((expense, index) => (
            <div key={index} className="group">
              {/* Info Row */}
              <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {expense.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({expense.percentage}%)
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {formatCurrency(expense.amount)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${getCategoryColor(expense.key || index)}`}
                  style={{ width: `${expense.percentage}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg text-sm">
            <AlertCircle size={16} />
            Chưa có dữ liệu chi tiết
          </div>
        )}
      </div>

      {/* FOOTER SUMMARY (GRID) */}
      <div className="mt-8 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <SummaryItem
            label="Giá vốn hàng bán"
            value={expenses.cogs}
            color="text-red-600"
          />
          <SummaryItem
            label="Marketing"
            value={expenses.marketing}
            color="text-purple-600"
          />
          <SummaryItem
            label="Vận chuyển"
            value={expenses.shipping}
            color="text-blue-600"
          />
          <SummaryItem
            label="Phí sàn"
            value={expenses.platformFees}
            color="text-orange-600"
          />
        </div>
      </div>
    </div>
  );
};

// Sub-component cho gọn
const SummaryItem = ({ label, value, color }) => (
  <div>
    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
    <div className={`font-semibold text-sm ${color || "text-gray-900"}`}>
      {new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value)}
    </div>
  </div>
);

export default ExpenseBreakdown;
