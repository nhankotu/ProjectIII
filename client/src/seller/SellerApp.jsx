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
import FlashSaleManagement from "./pages/FlashSaleManagement";
import ChatPage from "./pages/ChatPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProtectedRoute from "../global/components/ProtectedRoute";

import { SocketProvider } from "../contexts/SocketContext";

const SellerApp = () => {
  return (
    <SocketProvider>
      <Routes>
        <Route
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect dashboard dùng đường dẫn tuyệt đối */}
          <Route index element={<Navigate to="/seller/dashboard" replace />} />

          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="finance" element={<FinancialManagement />} />
          <Route path="shop" element={<ShopSettings />} />
          <Route path="flash-sales" element={<FlashSaleManagement />} />

          {/* Route Chat */}
          <Route path="messages" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/seller/dashboard" replace />} />
      </Routes>
    </SocketProvider>
  );
};

export default SellerApp;
