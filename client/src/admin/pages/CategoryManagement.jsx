// src/admin/pages/CategoryManagement.jsx
import React from "react";

const CategoryManagement = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản Lý Danh Mục</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>📁 Trang quản lý danh mục - Đang phát triển</p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Chức năng tương lai:</h3>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>Thêm/sửa/xóa danh mục</li>
            <li>Quản lý thương hiệu</li>
            <li>Sắp xếp hiển thị</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
