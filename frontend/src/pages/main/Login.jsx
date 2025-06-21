import React, { useState } from "react";
import { Navigate } from "react-router-dom";

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
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        setIsLoggedIn(true);
        setRedirect(true);
      } else {
        setErrorMessage(data.message || "Đăng nhập không thành công.");
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (redirect) return <Navigate to="/home" />;
  if (goToRegister) return <Navigate to="/register" />;

  return (
    <div className="flex flex-grow items-center justify-center bg-gray-100 min-h-[calc(100vh-128px)] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
          Đăng nhập
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700"
            >
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 rounded-md transition"
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setGoToRegister(true)}
              className="w-full sm:w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-md transition"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
