import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"; // ✅ Đã có import

import AdminApp from "./admin/AdminApp";
import SellerApp from "./seller/SellerApp";
import CustomerApp from "./customer/CustomerApp";
import Login from "./global/pages/Login";
import Register from "./global/pages/Register";
import NotFound from "./global/pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 🔑 Trang dùng chung */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🧩 Các hệ thống con */}
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/seller/*" element={<SellerApp />} />

          {/* 🏠 Trang chính */}
          <Route path="/*" element={<CustomerApp />} />
          <Route path="/category/*" element={<CustomerApp />} />
          <Route path="/product/*" element={<CustomerApp />} />
          <Route path="/cart/*" element={<CustomerApp />} />
          <Route path="/account/*" element={<CustomerApp />} />
          <Route path="/wishlist/*" element={<CustomerApp />} />
          <Route path="/support/*" element={<CustomerApp />} />
          <Route path="/checkout/*" element={<CustomerApp />} />
          <Route path="/search/*" element={<CustomerApp />} />
          {/* ⚠️ Trang mặc định hoặc sai đường dẫn */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {/* ✅ Toaster phải được render ở cuối để hoạt động */}
      <Toaster />
    </>
  );
}

export default App;
