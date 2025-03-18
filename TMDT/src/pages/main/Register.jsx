//register.jsx
import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import "../CssStyle/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [goToLogin, setgotoLogin] = useState(false);
  // Hàm xử lý khi form được submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
      setMessage("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      // Gửi yêu cầu đăng ký đến backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        }
      );
      console.log(response.data); // Log kết quả từ backend
      // Hiển thị thông báo thành công
      setMessage(response.data.message);
    } catch (err) {
      // Hiển thị lỗi nếu có
      setMessage(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  if (goToLogin) {
    return <Navigate to="/login" />;
  }
  return (
    <div class="register">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Return password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
        <button type="button" onClick={() => setgotoLogin(true)}>
          Login{" "}
        </button>
      </form>
      {message && <p>{message}</p>}{" "}
      {/* Hiển thị thông báo lỗi hoặc thành công */}
    </div>
  );
}

export default Register;
