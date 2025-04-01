import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserUpdate from "../../components/UserUpdate";

function User() {
  const navigate = useNavigate();
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
      setIsLoggedIn(true);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      console.log("🚀 Gửi yêu cầu đến API...");

      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🔍 Phản hồi API:", response);

      // Kiểm tra nếu phản hồi không phải JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API không trả về JSON");
      }

      const data = await response.json();
      console.log("✅ Dữ liệu từ API:", data);

      if (response.ok) {
        setUser(data);
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
        console.error("Lỗi:", data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/home");
  };

  return (
    <div>
      <h2>Trang Người dùng</h2>
      {isLoggedIn ? (
        <>
          {!showUpdate ? (
            <div>
              <img src={user.imgurl} alt="Avatar" width={100} height={100} />
              <p>Email: {user.email}</p>
              <p>Tên đăng nhập: {user.username}</p>
              <p>Thông tin: {user.ifmuser}</p>
              <p>Địa chỉ: {user.address}</p>
              <p>Số điện thoại: {user.phone}</p>
              <button onClick={() => setShowUpdate(true)}>
                Cập nhật thông tin
              </button>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          ) : (
            <UserUpdate
              user={user}
              setUser={setUser}
              handleUpdate={handleUpdate}
              setShowUpdate={setShowUpdate}
            />
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")}>Đăng nhập</button>
      )}
    </div>
  );
}

export default User;
