import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserUpdate from "../../components/UserUpdate";
import { useCart } from "../../components/contexts/CartContext";

function User() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    imgurl: "",
    ifmuser: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token); // chỉ fetch
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API không trả về JSON");
      }

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setIsLoggedIn(true);
      } else {
        console.error("❌ Lỗi từ server:", data.message);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu người dùng:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Cập nhật thành công!");
        setShowUpdate(false);
      } else {
        console.error("❌ Lỗi:", data.message);
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
    }
  };

  const handleLogout = () => {
    clearCart();
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail"); // ❗ thêm dòng này để xóa email
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {isLoggedIn ? (
        !showUpdate ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center">
              <img
                src={user.imgurl}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
              />
              <div className="w-full space-y-4 text-left">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mt-4">
                  <div className="bg-gray-50 rounded-md p-3 shadow-sm">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-800">
                      {user.email}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-3 shadow-sm">
                    <p className="text-sm text-gray-500">Tên đăng nhập</p>
                    <p className="text-base font-medium text-gray-800">
                      {user.username}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-3 shadow-sm">
                    <p className="text-sm text-gray-500">Thông tin</p>
                    <p className="text-base font-medium text-gray-800">
                      {user.ifmuser}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-3 shadow-sm">
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="text-base font-medium text-gray-800">
                      {user.address}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-3 shadow-sm">
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="text-base font-medium text-gray-800">
                      {user.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowUpdate(true)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2 rounded shadow"
                >
                  Cập nhật thông tin
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded shadow"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <UserUpdate
            user={user}
            setUser={setUser}
            handleUpdate={handleUpdate}
            setShowUpdate={setShowUpdate}
          />
        )
      ) : (
        <div className="flex justify-center pt-[25vh]">
          <div className="flex flex-row gap-4">
            <button
              onClick={() => navigate("/login")}
              className="w-32 bg-yellow-500 hover:bg-yellow-400 text-white py-2 rounded"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-32 bg-slate-600 hover:bg-slate-400 text-white py-2 rounded"
            >
              Đăng ký
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
