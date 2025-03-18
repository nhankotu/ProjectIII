import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "../../CssStyle/Login.css";
function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [goToRegister, setGoToRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", "true"); // Lưu trạng thái đăng nhập
        setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
        setRedirect(true); // Điều hướng đến trang chủ
      } else {
        setErrorMessage(data.message || "Đăng nhập không thành công.");
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (redirect) {
    return <Navigate to="/home" />;
  }
  // Điều hướng đến trang đăng ký khi bấm "Đăng ký"
  if (goToRegister) {
    return <Navigate to="/register" />;
  }
  return (
    <div class="login">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <button type="button" onClick={() => setGoToRegister(true)}>
          Register
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
