import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/main/Home"; // Trang chính Home
import Login from "./pages/main/Login";
import Register from "./pages/main/Register";
import NotFound from "./pages/main/NotFound";
import UserPage from "./pages/Home/UserPage"; // Trang User

import { CartProvider } from "./components/contexts/CartContext";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi chạy
  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn");
    if (storedLoginState === "true") {
      setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập nếu có token trong localStorage
    }
  }, []);

  // Cập nhật trạng thái đăng nhập khi thay đổi
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString()); // Lưu trạng thái đăng nhập vào localStorage
  }, [isLoggedIn]);

  // PrivateRoute kiểm tra trạng thái đăng nhập
  const PrivateRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Trang đăng nhập */}
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Trang Home chính */}
          <Route
            path="/home/*"
            element={<Home setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Trang đăng ký */}
          <Route path="/register" element={<Register />} />

          {/* Route cho trang không tìm thấy */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
