// src/admin/pages/ProductManagement.jsx
import React from "react";

const ProductManagement = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Duyệt Sản Phẩm</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>🛍️ Trang duyệt sản phẩm - Đang phát triển</p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Chức năng tương lai:</h3>
          <ul className="list-disc list-inside mt-2 text-sm">
            <li>Duyệt sản phẩm mới</li>
            <li>Gỡ sản phẩm vi phạm</li>
            <li>Quản lý danh mục</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
