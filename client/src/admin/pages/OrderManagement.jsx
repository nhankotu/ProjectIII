// src/admin/pages/OrderManagement.jsx
import React from "react";

const OrderManagement = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản Lý Đơn Hàng</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>📦 Trang quản lý đơn hàng - Đang phát triển</p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Chức năng tương lai:</h3>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>Xem tất cả đơn hàng</li>
            <li>Hỗ trợ xử lý đơn</li>
            <li>Theo dõi vận chuyển</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
