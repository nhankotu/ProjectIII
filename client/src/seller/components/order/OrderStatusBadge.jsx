import React from "react";

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", text: "Chờ xác nhận" },
    confirmed: { color: "bg-blue-100 text-blue-800", text: "Đã xác nhận" },
    packing: { color: "bg-purple-100 text-purple-800", text: "Đang đóng gói" },
    shipping: {
      color: "bg-orange-100 text-orange-800",
      text: "Đang giao hàng",
    },
    completed: { color: "bg-green-100 text-green-800", text: "Hoàn thành" },
    cancelled: { color: "bg-red-100 text-red-800", text: "Đã hủy" },
    returned: { color: "bg-gray-100 text-gray-800", text: "Trả hàng" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
    >
      {config.text}
    </span>
  );
};

export default OrderStatusBadge;
