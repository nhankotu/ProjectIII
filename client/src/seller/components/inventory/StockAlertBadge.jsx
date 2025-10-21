import React from "react";

const StockAlertBadge = ({ status, currentStock, safetyStock }) => {
  const getStatusConfig = () => {
    const configs = {
      out_of_stock: {
        color: "bg-red-100 text-red-800 border-red-200",
        text: "Hết hàng",
        icon: "🔴",
      },
      low_stock: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: `Sắp hết (${currentStock}/${safetyStock})`,
        icon: "⚠️",
      },
      in_stock: {
        color: "bg-green-100 text-green-800 border-green-200",
        text: `Đủ hàng (${currentStock})`,
        icon: "🟢",
      },
    };

    return configs[status] || configs.in_stock;
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </span>
  );
};

export default StockAlertBadge;
