// src/admin/AdminApp.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 1. Import các Pages (Đảm bảo đường dẫn import đúng với folder của bạn)
import DashboardPage from "./pages/DashboardPage";
import FlashSalesPage from "./pages/FlashSalesPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProtectedRoute from "../global/components/ProtectedRoute";
// 2. Import Layout
import AdminLayout from "./components/Layout/AdminLayout";

// 3. Import Hook Auth (Để check quyền chuẩn xác)
import { useAuth } from "../contexts/AuthContext"; // Sửa đường dẫn nếu cần

// --- COMPONENT BẢO VỆ ROUTE ---

const AdminApp = () => {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Đường dẫn mặc định: /admin -> redirect sang /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Các trang con (Lưu ý: không có dấu / ở đầu) */}
        {/* URL thực tế: /admin/dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* URL thực tế: /admin/flash-sales */}
        <Route path="flash-sales" element={<FlashSalesPage />} />

        {/* URL thực tế: /admin/categories */}
        <Route path="categories" element={<CategoriesPage />} />

        {/* URL thực tế: /admin/products */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        {/* URL thực tế: /admin/users */}
        <Route path="users" element={<UsersPage />} />
      </Route>

      {/* Route 404 nội bộ của Admin */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminApp;
