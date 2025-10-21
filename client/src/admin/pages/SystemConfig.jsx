// src/admin/pages/SystemConfig.jsx
import React from "react";

const SystemConfig = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cấu Hình Hệ Thống</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>⚙️ Trang cấu hình hệ thống - Đang phát triển</p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Chức năng tương lai:</h3>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>Cấu hình phí dịch vụ</li>
            <li>Quản lý mã giảm giá</li>
            <li>Cài đặt hệ thống</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
