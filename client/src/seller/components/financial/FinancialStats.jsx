import React from "react";

const FinancialStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
    isCurrency = false,
    isPercentage = false,
  }) => {
    let displayValue = value;

    if (isCurrency) {
      displayValue = formatCurrency(value);
    } else if (isPercentage) {
      displayValue = `${value}%`;
    }

    return (
      <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{displayValue}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="text-3xl opacity-80">{icon}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Doanh thu"
        value={stats.revenue}
        icon="💰"
        color="border-green-500"
        subtitle="Tháng này"
        isCurrency={true}
      />

      <StatCard
        title="Lợi nhuận"
        value={stats.profit}
        icon="📈"
        color="border-blue-500"
        subtitle="Sau chi phí"
        isCurrency={true}
      />

      <StatCard
        title="Biên lợi nhuận"
        value={stats.profitMargin}
        icon="📊"
        color="border-purple-500"
        subtitle="Tỷ lệ %"
        isPercentage={true}
      />

      <StatCard
        title="Đơn hàng"
        value={stats.orders}
        icon="🛒"
        color="border-orange-500"
        subtitle="Tháng này"
      />
    </div>
  );
};

export default FinancialStats;
