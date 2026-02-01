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
import RevenuePlatformPage from "./pages/RevenuePlatformPage";
import RevenueShopsPage from "./pages/RevenueShopsPage";
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
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="revenue/platform" element={<RevenuePlatformPage />} />
        <Route path="revenue/shops" element={<RevenueShopsPage />} />

        <Route path="flash-sales" element={<FlashSalesPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminApp;
