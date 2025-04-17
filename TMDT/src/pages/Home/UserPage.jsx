import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserUpdate from "../../components/UserUpdate";
import "../../CssStyle/UserPage.css";

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
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/home");
  };

  return (
    <div className="user-container">
      {isLoggedIn ? (
        !showUpdate ? (
          <div className="user-info">
            <img src={user.imgurl} alt="Avatar" className="user-avatar" />
            <div className="user-details">
              <div className="user-field">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="user-field">
                <span className="label">Tên đăng nhập:</span>
                <span className="value">{user.username}</span>
              </div>
              <div className="user-field">
                <span className="label">Thông tin:</span>
                <span className="value">{user.ifmuser}</span>
              </div>
              <div className="user-field">
                <span className="label">Địa chỉ:</span>
                <span className="value">{user.address}</span>
              </div>
              <div className="user-field">
                <span className="label">Số điện thoại:</span>
                <span className="value">{user.phone}</span>
              </div>
            </div>
            <div className="user-buttons">
              <button onClick={() => setShowUpdate(true)}>
                Cập nhật thông tin
              </button>
              <button onClick={handleLogout}>Đăng xuất</button>
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
        <div className="auth-buttons">
          <button onClick={() => navigate("/login")}>Đăng nhập</button>
          <button onClick={() => navigate("/register")}>Đăng ký</button>
        </div>
      )}
    </div>
  );
}

export default User;
