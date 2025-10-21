// src/admin/pages/FinancialManagement.jsx
import React from "react";

const FinancialManagement = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản Lý Tài Chính</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>💰 Trang quản lý tài chính - Đang phát triển</p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Chức năng tương lai:</h3>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>Doanh thu hệ thống</li>
            <li>Thanh toán cho seller</li>
            <li>Báo cáo tài chính</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
