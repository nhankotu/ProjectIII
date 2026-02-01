import React from "react";
import { DollarSign, TrendingUp, Percent, ShoppingCart } from "lucide-react";

const FinancialStats = ({ stats }) => {
  // 1. Helper Format: Số rút gọn (VD: 1.2 Tr)
  const formatCompact = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount || 0);
  };

  // 2. Helper Format: Số đầy đủ (VD: 1.200.000 ₫) - Dùng cho Tooltip
  const formatFull = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // 3. Sub-component Card
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    bg,
    type = "currency",
    subtitle,
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>

          <div className="relative group w-fit">
            <h3 className="text-2xl font-bold text-gray-900 cursor-help">
              {type === "currency"
                ? formatCompact(value)
                : type === "percentage"
                  ? `${value}%`
                  : value}
            </h3>

            {/* Tooltip hiển thị số đầy đủ khi hover */}
            {type === "currency" && (
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap">
                  {formatFull(value)}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>

        {/* Icon Badge */}
        <div className={`p-3 rounded-lg ${bg} ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Tổng Doanh Thu"
        value={stats.revenue}
        icon={DollarSign}
        color="text-blue-600"
        bg="bg-blue-50"
        subtitle="Thu nhập trước thuế"
      />

      <StatCard
        title="Lợi Nhuận Ròng"
        value={stats.profit}
        icon={TrendingUp}
        color="text-green-600"
        bg="bg-green-50"
        subtitle="Sau khi trừ chi phí"
      />

      <StatCard
        title="Biên Lợi Nhuận"
        value={stats.profitMargin}
        type="percentage"
        icon={Percent}
        color="text-purple-600"
        bg="bg-purple-50"
        subtitle="Hiệu quả kinh doanh"
      />

      <StatCard
        title="Tổng Đơn Hàng"
        value={stats.orders}
        type="number"
        icon={ShoppingCart}
        color="text-orange-600"
        bg="bg-orange-50"
        subtitle="Đơn hàng thành công"
      />
    </div>
  );
};

export default FinancialStats;
