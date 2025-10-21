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
          action: "pack",
          label: "Đóng gói",
          color: "bg-purple-600 hover:bg-purple-700",
        },
        {
          action: "cancel",
          label: "Hủy đơn",
          color: "bg-red-600 hover:bg-red-700",
        },
      ],
      packing: [
        {
          action: "ship",
          label: "Giao hàng",
          color: "bg-orange-600 hover:bg-orange-700",
        },
      ],
      shipping: [
        {
          action: "complete",
          label: "Hoàn thành",
          color: "bg-green-600 hover:bg-green-700",
        },
      ],
      completed: [],
      cancelled: [],
      returned: [],
    };

    return actions[status] || [];
  };

  const handleAction = (action) => {
    const statusMap = {
      confirm: "confirmed",
      pack: "packing",
      ship: "shipping",
      complete: "completed",
      cancel: "cancelled",
    };

    if (statusMap[action]) {
      onUpdateStatus(order.id, statusMap[action]);
    }
  };

  const availableActions = getAvailableActions(order.status);

  if (availableActions.length === 0) {
    return <span className="text-sm text-gray-500">Không có thao tác</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {availableActions.map(({ action, label, color }) => (
        <button
          key={action}
          onClick={() => handleAction(action)}
          className={`px-3 py-1 text-xs text-white rounded-md transition-colors ${color}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default OrderActions;
