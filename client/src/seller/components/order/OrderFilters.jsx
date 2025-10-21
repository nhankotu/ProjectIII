import React from "react";

const OrderFilters = ({
  searchTerm,
  statusFilter,
  dateFilter,
  onSearchChange,
  onStatusFilterChange,
  onDateFilterChange,
  onRefresh,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="packing">Đang đóng gói</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
          >
            🔄 Làm mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
