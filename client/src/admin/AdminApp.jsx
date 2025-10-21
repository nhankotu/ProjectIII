// src/admin/AdminApp.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import SellerManagement from "./pages/SellerManagement";
import ProductManagement from "./pages/ProductManagement";
import CategoryManagement from "./pages/CategoryManagement";
import OrderManagement from "./pages/OrderManagement";
import FinancialManagement from "./pages/FinancialManagement";
import SystemConfig from "./pages/SystemConfig";

const AdminApp = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/sellers" element={<SellerManagement />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/categories" element={<CategoryManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/financial" element={<FinancialManagement />} />
        <Route path="/system" element={<SystemConfig />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
