import React from "react";

const InventoryStats = ({ stats }) => {
  const formatCompactNumber = (number) => {
    if (!number) return "0";
    return new Intl.NumberFormat("vi-VN", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(number);
  };

  const formatFullCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const StatCard = ({ title, value, fullValue, icon, color, subtitle }) => (
    <div
      className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${color} hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 mb-1 truncate">{title}</p>

          <div className="relative group w-fit">
            {" "}
            <p className="text-2xl font-bold text-gray-800 truncate cursor-help">
              {value}
            </p>
            {fullValue && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-xl">
                  {fullValue}

                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
          </div>

          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>

        <div className="text-3xl opacity-80 shrink-0">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
      <StatCard
        title="Tổng sản phẩm"
        value={stats.total || 0}
        fullValue={stats.total}
        icon="📦"
        color="border-blue-500"
        subtitle="SKU trong kho"
      />

      <StatCard
        title="Sắp hết hàng"
        value={stats.lowStock || 0}
        icon="⚠️"
        color="border-yellow-500"
        subtitle="Cần nhập thêm"
      />

      <StatCard
        title="Hết hàng"
        value={stats.outOfStock || 0}
        icon="🔴"
        color="border-red-500"
        subtitle="Cần xử lý ngay"
      />

      <StatCard
        title="Giá trị tồn kho"
        value={
          stats.totalValue ? `${formatCompactNumber(stats.totalValue)}` : "0"
        }
        fullValue={formatFullCurrency(stats.totalValue || 0)}
        icon="💰"
        color="border-green-500"
        subtitle="Tổng giá trị"
      />

      <StatCard
        title="Đang hoạt động"
        value={stats.active || 0}
        icon="✅"
        color="border-green-500"
        subtitle="Sản phẩm đang bán"
      />
    </div>
  );
};

export default InventoryStats;
