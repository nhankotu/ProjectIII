import React from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const RevenueChart = ({ revenueReport }) => {
  // 1. Format tiền tệ an toàn
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // 2. Lấy dữ liệu an toàn từ props
  // Backend trả về: dailyRevenue: [{ date, total }], byCategory: [{ name, total, percentage }]
  const dailyData = revenueReport?.dailyRevenue || [];
  const categoryData = revenueReport?.byCategory || [];
  const currentRevenue = revenueReport?.current || 0;
  const growth = revenueReport?.growth || 0;

  // 3. Tính giá trị lớn nhất để vẽ chiều cao cột (Tránh chia cho 0)
  const maxRevenue = Math.max(...dailyData.map((d) => d.total || 0)) || 1;

  // 4. Danh sách màu cho Category
  const COLORS = [
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      {/* HEADER: Tổng quan */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Doanh thu 7 ngày</h3>
          <p className="text-sm text-gray-500">Tổng quan hiệu suất bán hàng</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(currentRevenue)}
          </p>
          <div
            className={`text-sm flex items-center justify-end gap-1 ${
              growth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {growth >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span className="font-medium">{Math.abs(growth)}%</span>
            <span className="text-gray-500">so với kỳ trước</span>
          </div>
        </div>
      </div>

      {/* --- PHẦN 1: BIỂU ĐỒ CỘT (BAR CHART) --- */}
      <div className="flex-1 min-h-[200px] flex items-end justify-between gap-2 pb-2 border-b border-gray-100">
        {dailyData.length > 0 ? (
          dailyData.map((day, index) => {
            // 🔥 QUAN TRỌNG: Dùng day.total thay vì day.revenue
            // Tính chiều cao % (Nếu có số liệu > 0 thì tối thiểu hiển thị 2% cho đẹp)
            const rawPercent = ((day.total || 0) / maxRevenue) * 100;
            const height = rawPercent > 0 && rawPercent < 2 ? 2 : rawPercent;

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-end flex-1 h-full group"
              >
                <div className="w-full h-full flex items-end justify-center relative">
                  {/* Tooltip khi hover */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 pointer-events-none shadow-lg">
                    {formatCurrency(day.total)}
                  </div>

                  {/* Cột hiển thị */}
                  <div
                    className="w-full max-w-[40px] bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all duration-300 relative"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  {day.date}
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Chưa có dữ liệu doanh thu
          </div>
        )}
      </div>

      {/* --- PHẦN 2: DANH SÁCH DANH MỤC (CATEGORY LIST) --- */}
      <div className="mt-6">
        <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">
          Theo danh mục
        </h4>
        <div className="space-y-4">
          {categoryData.length > 0 ? (
            categoryData.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors -mx-2"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      COLORS[index % COLORS.length]
                    }`}
                  ></div>

                  {/* 🔥 QUAN TRỌNG: Dùng category.name thay vì category.category */}
                  <span
                    className="text-sm font-medium text-gray-700 truncate"
                    title={category.name}
                  >
                    {category.name}
                  </span>
                </div>
                <div className="text-right shrink-0 ml-4">
                  {/* 🔥 QUAN TRỌNG: Dùng category.total thay vì category.revenue */}
                  <div className="font-bold text-sm text-gray-900">
                    {formatCurrency(category.total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.percentage}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <AlertCircle size={16} /> Chưa có dữ liệu danh mục
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
