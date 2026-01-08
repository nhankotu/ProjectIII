import React from "react";

const InventoryStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // ✅ Tính toán tỷ lệ xoay vòng (turnover rate) từ dữ liệu thực
  const calculateTurnoverRate = () => {
    if (!stats.total || stats.total === 0) return "0%";

    // Giả sử: Tỷ lệ xoay vòng = (Tổng đã bán / Tổng tồn kho) * 100
    // Trong thực tế, bạn cần có dữ liệu sales từ API
    const totalSold = stats.totalSales || 0;
    const totalInventory = stats.total;
    const rate = (totalSold / totalInventory) * 100;

    return isNaN(rate) ? "0%" : `${Math.round(rate)}%`;
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
      {/* ✅ SỬA: totalProducts → total */}
      <StatCard
        title="Tổng sản phẩm"
        value={stats.total || 0}
        icon="📦"
        color="border-blue-500"
        subtitle="SKU trong kho"
      />

      {/* ✅ SỬA: lowStockProducts → lowStock */}
      <StatCard
        title="Sắp hết hàng"
        value={stats.lowStock || 0}
        icon="⚠️"
        color="border-yellow-500"
        subtitle="Cần nhập thêm"
      />

      {/* ✅ SỬA: outOfStockProducts → outOfStock */}
      <StatCard
        title="Hết hàng"
        value={stats.outOfStock || 0}
        icon="🔴"
        color="border-red-500"
        subtitle="Cần xử lý ngay"
      />

      {/* ✅ SỬA: totalValue (giữ nguyên) */}
      <StatCard
        title="Giá trị tồn kho"
        value={formatCurrency(stats.totalValue || 0)}
        icon="💰"
        color="border-green-500"
        subtitle="Tổng giá trị"
      />

      {/* ✅ SỬA: Tính toán turnover rate thực tế */}
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
