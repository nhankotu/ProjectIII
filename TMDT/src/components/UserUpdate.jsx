import React, { useState } from "react";
import "../CssStyle/UserUpdate.css";

function UserUpdate({ user, setUser, handleUpdate, setShowUpdate }) {
  return (
    <div className="user-update-page">
      <h2>Cập nhật thông tin</h2>
      <input
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="Tên đăng nhập"
      />
      <input
        type="text"
        value={user.ifmuser}
        onChange={(e) => setUser({ ...user, ifmuser: e.target.value })}
        placeholder="Thông tin người dùng"
      />
      <input
        type="text"
        value={user.address}
        onChange={(e) => setUser({ ...user, address: e.target.value })}
        placeholder="Địa chỉ"
      />
      <input
        type="text"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
        placeholder="Số điện thoại"
      />
      <div className="button-container">
        <button onClick={handleUpdate}>Lưu thay đổi</button>
        <div className="bg-blue-500 text-white p-6">
          Tailwind CSS is working!
        </div>
        <button onClick={() => setShowUpdate(false)}>Hủy</button>
      </div>
    </div>
  );
}

export default UserUpdate;
