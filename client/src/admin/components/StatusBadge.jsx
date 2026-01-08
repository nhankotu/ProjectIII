// src/components/admin/Common/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Chờ duyệt",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "approved":
        return {
          text: "Đã duyệt",
          className: "bg-green-100 text-green-800",
        };
      case "rejected":
        return {
          text: "Từ chối",
          className: "bg-red-100 text-red-800",
        };
      case "hidden":
        return {
          text: "Ẩn",
          className: "bg-gray-100 text-gray-800",
        };
      case "out_of_stock":
        return {
          text: "Hết hàng",
          className: "bg-orange-100 text-orange-800",
        };
      case "draft":
        return {
          text: "Bản nháp",
          className: "bg-blue-100 text-blue-800",
        };
      default:
        return {
          text: status,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
    >
      {config.text}
    </span>
  );
};

export default StatusBadge;
