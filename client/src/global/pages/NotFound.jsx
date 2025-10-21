import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
    <p className="text-xl mb-6">Trang bạn tìm không tồn tại</p>
    <Link to="/" className="bg-indigo-600 text-white px-4 py-2 rounded">
      Quay về trang chủ
    </Link>
  </div>
);

export default NotFound;
