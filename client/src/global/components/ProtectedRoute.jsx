import React from "react";
import { Navigate } from "react-router-dom";
// ⚠️ Kiểm tra đường dẫn import AuthContext cho đúng với dự án của bạn
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // 1. MÀN HÌNH CHỜ (Quan trọng nhất để tránh lỗi)
  // Nếu AuthContext đang tải user, hiển thị Loading thay vì đá về Login
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          {/* Spinner đơn giản bằng Tailwind */}
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-3 text-sm font-medium text-gray-600">
            Đang kiểm tra quyền...
          </p>
        </div>
      </div>
    );
  }

  // 2. Tải xong mà không có user -> Chưa đăng nhập -> Về Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Có user nhưng sai quyền (VD: Customer cố vào trang Admin) -> Về trang chủ
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // 4. Mọi thứ OK -> Hiển thị nội dung
  return children;
};

export default ProtectedRoute;
