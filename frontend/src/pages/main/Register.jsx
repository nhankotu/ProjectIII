import React, { useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [goToLogin, setGotoLogin] = useState(false);

  // Gửi OTP (bước đầu tiên)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !username || !password || !confirmPassword) {
      setMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Mật khẩu không khớp.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email,
        username,
      });

      setIsOtpSent(true);
      if (res.data.success) {
        setMessage("OTP đã được gửi về email.");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setIsOtpSent(true);
      setMessage(err.response?.data?.message || "Lỗi khi gửi OTP.");
    }
  };

  // Xác minh OTP và Đăng ký
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Vui lòng nhập OTP.");
      return;
    }

    try {
      const verifyRes = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      if (!verifyRes.data.isVerified) {
        setMessage("Mã OTP không chính xác.");
        return;
      }

      const registerRes = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email,
          username,
          password,
        }
      );

      if (registerRes.data.message) {
        setMessage("Đăng ký thành công! Đang chuyển hướng sau 5s");
        setTimeout(() => {
          setGotoLogin(true);
        }, 5000);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Lỗi khi xác minh hoặc đăng ký."
      );
    }
  };

  if (goToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng ký</h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên người dùng"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={handleSendOtp}
            className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            Gửi OTP
          </button>

          {isOtpSent && (
            <>
              <input
                type="text"
                placeholder="Nhập OTP"
                className="w-full p-2 border rounded"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="submit"
                onClick={handleVerifyAndRegister}
                className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
              >
                Xác minh OTP & Đăng ký
              </button>
            </>
          )}
        </form>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}

        <p className="mt-6 text-center text-gray-700">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
