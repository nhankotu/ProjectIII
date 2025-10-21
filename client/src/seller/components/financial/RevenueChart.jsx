import React from "react";

const RevenueChart = ({ revenueReport }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const maxRevenue = Math.max(
    ...revenueReport.dailyRevenue.map((d) => d.revenue)
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Doanh thu 7 ngày gần nhất</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(revenueReport.current)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="text-green-500">↑ {revenueReport.growth}%</span> so
            với tháng trước
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between h-48 mt-4 space-x-2">
        {revenueReport.dailyRevenue.map((day, index) => {
          const height = (day.revenue / maxRevenue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="text-xs text-gray-500 mb-2">{day.date}</div>
              <div
                className="bg-green-500 rounded-t w-full max-w-12 transition-all duration-300 hover:bg-green-600 cursor-pointer relative group"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 hidden group-hover:block whitespace-nowrap">
                  {formatCurrency(day.revenue)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue by Category */}
      <div className="mt-8">
        <h4 className="font-semibold mb-4">Doanh thu theo danh mục</h4>
        <div className="space-y-3">
          {revenueReport.byCategory.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">{category.category}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatCurrency(category.revenue)}
                </div>
                <div className="text-xs text-gray-500">
                  {category.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
