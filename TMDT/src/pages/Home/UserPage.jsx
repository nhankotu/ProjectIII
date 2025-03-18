// src/pages/User.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function User() {
  const navigate = useNavigate();

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    localStorage.setItem("isLoggedIn", "false"); // Cập nhật trạng thái đăng xuất vào localStorage
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div>
      <h2>Trang Người dùng</h2>
      <p>Thông tin người dùng sẽ được hiển thị tại đây.</p>
      {/* update user ( img, use name,text,address,phone )*/}
      {/* Nút đăng xuất */}
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}

export default User;
