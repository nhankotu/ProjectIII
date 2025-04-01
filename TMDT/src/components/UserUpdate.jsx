import React, { useState } from "react";

function UserUpdate({ user, setUser, handleUpdate, setShowUpdate }) {
  return (
    <div>
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
      <button onClick={handleUpdate}>Lưu thay đổi</button>
      <button onClick={() => setShowUpdate(false)}>Hủy</button>
    </div>
  );
}

export default UserUpdate;
