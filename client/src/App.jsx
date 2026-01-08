import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// 1. IMPORT CÁC CONTEXT PROVIDER
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import AdminApp from "./admin/AdminApp";
import SellerApp from "./seller/SellerApp";
import CustomerApp from "./customer/CustomerApp";
import Login from "./global/pages/Login";
import Register from "./global/pages/Register";
import NotFound from "./global/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      {/* 2. BỌC PROVIDER Ở CẤP CAO NHẤT (Bên trong BrowserRouter) */}
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* 🔑 Trang dùng chung - Giờ đây Login đã truy cập được AuthContext */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🧩 Các hệ thống con */}
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/seller/*" element={<SellerApp />} />

            {/* 🏠 Trang chính */}
            <Route path="/*" element={<CustomerApp />} />

            {/* ⚠️ Trang mặc định */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Toaster để trong Provider để chắc chắn nhận được style/context nếu cần */}
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
