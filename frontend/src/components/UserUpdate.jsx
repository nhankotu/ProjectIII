import React from "react";

function UserUpdate({ user, setUser, handleUpdate, setShowUpdate }) {
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center text-yellow-500 mb-6">
        Cập nhật thông tin
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Tên đăng nhập"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="text"
          value={user.ifmuser}
          onChange={(e) => setUser({ ...user, ifmuser: e.target.value })}
          placeholder="Thông tin người dùng"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="text"
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          placeholder="Địa chỉ"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="text"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          placeholder="Số điện thoại"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="flex justify-between mt-6 space-x-4">
        <button
          onClick={handleUpdate}
          className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Lưu thay đổi
        </button>
        <button
          onClick={() => setShowUpdate(false)}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}

export default UserUpdate;
