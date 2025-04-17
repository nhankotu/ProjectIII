import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import "../../CssStyle/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [goToLogin, setGotoLogin] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState("");

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

      // Hiển thị thông báo thành công và yêu cầu nhập OTP
      setMessage(response.data.message);
      setShowOTPForm(true); // Hiển thị form OTP
    } catch (err) {
      // Hiển thị lỗi nếu có
      setMessage(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  // Hàm xử lý xác minh OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Vui lòng nhập mã OTP.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );
      setMessage(res.data.message);
      if (res.data.success) {
        setGotoLogin(true); // Chuyển sang trang login nếu xác minh thành công
      }
    } catch (err) {
      setMessage("OTP không chính xác hoặc đã hết hạn.");
    }
  };

  // Điều hướng về trang login sau khi xác minh thành công
  if (goToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="register">
      <h1>Đăng ký</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Tên người dùng:</label>
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
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng ký</button>
        <button type="button" onClick={() => setGotoLogin(true)}>
          Đăng nhập
        </button>
      </form>
      {showOTPForm && (
        <div className="otp-form">
          <label>Nhập mã OTP đã gửi về email:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="button" onClick={handleVerifyOtp}>
            Xác minh OTP
          </button>
        </div>
      )}
      {message && <p>{message}</p>}{" "}
      {/* Hiển thị thông báo lỗi hoặc thành công */}
    </div>
  );
}

export default Register;
