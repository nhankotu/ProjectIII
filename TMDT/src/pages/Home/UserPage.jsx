// src/pages/User.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function User() {
  const navigate = useNavigate();

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
    navigate("/home");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div>
      <h2>Trang Người dùng</h2>
      <p>Thông tin người dùng sẽ được hiển thị tại đây.</p>
      {/* update user ( img, use name,text,address,phone )*/}
      <button onClick={handleLogin}> Đăng nhập</button>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}

export default User;
