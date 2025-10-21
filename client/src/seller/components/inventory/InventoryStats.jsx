import React from "react";

const InventoryStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <StatCard
        title="Tổng sản phẩm"
        value={stats.totalProducts}
        icon="📦"
        color="border-blue-500"
        subtitle="SKU trong kho"
      />

      <StatCard
        title="Sắp hết hàng"
        value={stats.lowStockProducts}
        icon="⚠️"
        color="border-yellow-500"
        subtitle="Cần nhập thêm"
      />

      <StatCard
        title="Hết hàng"
        value={stats.outOfStockProducts}
        icon="🔴"
        color="border-red-500"
        subtitle="Cần xử lý ngay"
      />

      <StatCard
        title="Giá trị tồn kho"
        value={formatCurrency(stats.totalValue)}
        icon="💰"
        color="border-green-500"
        subtitle="Tổng giá trị"
      />

      <StatCard
        title="Tỷ lệ xoay vòng"
        value={stats.turnoverRate}
        icon="📈"
        color="border-purple-500"
        subtitle="Vòng quay/năm"
      />
    </div>
  );
};

export default InventoryStats;
