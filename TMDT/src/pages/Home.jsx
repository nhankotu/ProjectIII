import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import HomePage from "./Home/HomePage"; // Trang HomePage
import SearchPage from "./Home/SearchPage"; // Trang Tìm kiếm
import CartPage from "./Home/CartPage"; // Trang Giỏ hàng
import ContactPage from "./Home/ContactPage"; // Trang Liên hệ shop
import UserPage from "./Home/UserPage"; // Trang User
import "../Stylecss/Home.css"; // Đảm bảo rằng bạn có file CSS tương ứng

function Home({ setIsLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  return (
    <div>
      {/* Phần Navigation luôn hiển thị */}
      <nav className="container">
        <Link to="/home">
          <h2>Trang chủ</h2>
        </Link>
        <Link to="/home/search">
          <h2>Tìm kiếm</h2>
        </Link>
        <Link to="/home/cart">
          <h2>Giỏ hàng</h2>
        </Link>
        <Link to="/home/contact">
          <h2>Liên hệ shop</h2>
        </Link>
        <Link to="/home/user">
          <h2>User</h2>
        </Link>
      </nav>

      {/* Phần nội dung thay đổi tùy thuộc vào route */}
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
