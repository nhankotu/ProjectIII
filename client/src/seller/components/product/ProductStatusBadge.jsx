import React from "react";

const ProductStatusBadge = ({ status, stock }) => {
  const getStatusConfig = () => {
    let actualStatus = status;
    if (stock === 0) {
      actualStatus = "out_of_stock";
    } else if (stock <= 10) {
      actualStatus = "low_stock";
    }

    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Đang bán" },
      inactive: { color: "bg-gray-100 text-gray-800", text: "Ngừng bán" },
      out_of_stock: { color: "bg-red-100 text-red-800", text: "Hết hàng" },
      low_stock: { color: "bg-yellow-100 text-yellow-800", text: "Sắp hết" },
      pending: { color: "bg-blue-100 text-blue-800", text: "Chờ duyệt" },
    };

    return statusConfig[actualStatus] || statusConfig.pending;
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
    >
      {config.text}
    </span>
  );
};

export default ProductStatusBadge;
