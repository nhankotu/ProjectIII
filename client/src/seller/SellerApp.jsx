import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import Layout & Pages
import SellerLayout from "./components/SellerLayout";
import SellerDashboard from "./pages/SellerDashboard";
import ProductManagement from "./pages/ProductManagement";
import OrderManagement from "./pages/OrderManagement";
import InventoryManagement from "./pages/InventoryManagement";
import FinancialManagement from "./pages/FinancialManagement";
import ShopSettings from "./pages/ShopSetting";
// 👇 1. IMPORT TRANG FLASH SALE MỚI
import FlashSaleManagement from "./pages/FlashSaleManagement";

// Import ProtectedRoute chung
import ProtectedRoute from "../global/components/ProtectedRoute";

const SellerApp = () => {
  return (
    <Routes>
      <Route
        element={
          // Bọc Layout bằng ProtectedRoute + Role Seller
          <ProtectedRoute requiredRole="seller">
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect mặc định vào dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Các trang con */}
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="finance" element={<FinancialManagement />} />
        <Route path="shop" element={<ShopSettings />} />

        {/* 👇 2. THÊM ROUTE CHO FLASH SALE */}
        <Route path="flash-sales" element={<FlashSaleManagement />} />
      </Route>

      {/* Route 404 nội bộ của Seller */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default SellerApp;
