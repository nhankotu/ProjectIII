// src/seller/SellerApp.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SellerLayout from "./components/SellerLayout";
import SellerDashboard from "./pages/SellerDashboard";
import ProductManagement from "./pages/ProductManagement";
import OrderManagement from "./pages/OrderManagement";
import InventoryManagement from "./pages/InventoryManagement";
import FinancialManagement from "./pages/FinancialManagement";
import ShopSettings from "./pages/ShopSetting";

const SellerApp = () => {
  return (
    <SellerLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/seller/dashboard" replace />} />
        <Route path="/dashboard" element={<SellerDashboard />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/finance" element={<FinancialManagement />} />
        <Route path="/shop" element={<ShopSettings />} />
      </Routes>
    </SellerLayout>
  );
};

export default SellerApp;
