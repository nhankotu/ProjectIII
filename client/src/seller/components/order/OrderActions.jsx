import React from "react";

const OrderActions = ({ order, onUpdateStatus }) => {
  const getAvailableActions = (status) => {
    const actions = {
      pending: [
        {
          action: "confirm",
          label: "Xác nhận",
          color: "bg-blue-600 hover:bg-blue-700",
        },
        {
          action: "cancel",
          label: "Hủy đơn",
          color: "bg-red-600 hover:bg-red-700",
        },
      ],
      confirmed: [
        {
          action: "ship", // Sửa: Từ confirmed cho phép đi ship luôn hoặc pack
          label: "Giao hàng",
          color: "bg-orange-600 hover:bg-orange-700",
        },
        {
          action: "cancel",
          label: "Hủy đơn",
          color: "bg-red-600 hover:bg-red-700",
        },
      ],
      shipping: [
        {
          action: "complete",
          label: "Hoàn thành",
          color: "bg-green-600 hover:bg-green-700",
        },
      ],
      delivered: [], // Đồng bộ với Enum "delivered" trong Model
      cancelled: [],
      returned: [],
    };

    return actions[status] || [];
  };

  const handleAction = (action) => {
    const statusMap = {
      confirm: "confirmed",
      ship: "shipping",
      complete: "delivered", // 🔥 Sửa: "completed" -> "delivered" cho khớp Model
      cancel: "cancelled",
    };

    if (statusMap[action]) {
      // 🔥 Sửa: order.id -> order._id
      onUpdateStatus(order._id || order.id, statusMap[action]);
    }
  };

  const availableActions = getAvailableActions(order.status);

  if (availableActions.length === 0) {
    return (
      <span className="text-sm text-gray-500 italic">Không có thao tác</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {availableActions.map(({ action, label, color }) => (
        <button
          key={action}
          onClick={(e) => {
            e.stopPropagation(); // Ngăn việc bấm nút làm mở Modal chi tiết
            handleAction(action);
          }}
          className={`px-3 py-1 text-xs text-white font-medium rounded-md shadow-sm transition-all active:scale-95 ${color}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default OrderActions;
