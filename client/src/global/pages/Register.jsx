import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    otp: "",
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gửi thông tin đăng ký (có hoặc không có OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      setIsLoading(false);
      return;
    }

    try {
      // Chuẩn bị data để gửi
      const requestData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      // Chỉ thêm OTP nếu người dùng đã nhập
      if (formData.otp && formData.otp.trim() !== "") {
        requestData.otp = formData.otp;
      }

      console.log("🔄 Gửi request:", requestData);

      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();
      console.log("📨 Response từ server:", data);

      if (res.ok) {
        if (data.requiresOTP || !formData.otp) {
          // Bước 1: OTP đã được gửi
          alert(
            data.message ||
              "OTP đã được gửi đến email! Vui lòng kiểm tra và nhập OTP."
          );
          setShowOTPModal(true);
        } else {
          // Bước 2: Đăng ký thành công
          alert("Đăng ký thành công!");
          navigate("/login");
        }
      } else {
        alert(data.message || "Có lỗi xảy ra!");

        // Nếu lỗi do OTP, vẫn hiển thị modal để nhập lại
        if (data.message?.includes("OTP")) {
          setShowOTPModal(true);
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xác nhận OTP
  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      alert("Vui lòng nhập OTP.");
      return;
    }
    await handleSubmit(new Event("submit")); // Gửi lại form với OTP
  };

  // Gửi lại OTP
  const handleResendOTP = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          // KHÔNG gửi OTP để trigger gửi OTP mới
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("OTP mới đã được gửi đến email!");
      } else {
        alert(data.message || "Gửi lại OTP thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối server.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Đăng ký tài khoản
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
            disabled={showOTPModal} // Khóa form khi đang nhập OTP
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
            disabled={showOTPModal}
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
            disabled={showOTPModal}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
            disabled={showOTPModal}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            disabled={showOTPModal}
          >
            <option value="customer">Người mua</option>
            <option value="seller">Người bán</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        {/* OTP Modal */}
        {showOTPModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Nhập OTP
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Mã OTP đã được gửi đến: {formData.email}
              </p>
              <input
                type="text"
                placeholder="Nhập mã OTP 6 số"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value })
                }
                className="w-full p-3 border rounded-lg mb-4 text-center text-lg"
                maxLength={6}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition"
                >
                  {isLoading ? "Đang xác thực..." : "Xác nhận"}
                </button>
                <button
                  onClick={handleResendOTP}
                  className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Gửi lại OTP
                </button>
              </div>
              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setFormData({ ...formData, otp: "" });
                }}
                className="w-full mt-2 bg-gray-300 text-black p-3 rounded-lg hover:bg-gray-400 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
