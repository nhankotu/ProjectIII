import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { username, password } = form;
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Đăng nhập thành công!");

        switch (data.user.role) {
          case "admin":
            navigate("/admin");
            break;
          case "seller":
            navigate("/seller");
            break;
          default:
            navigate("/customer");
        }
      } else {
        toast.error(data.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể kết nối tới máy chủ!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6 drop-shadow-sm">
          Đăng nhập tài khoản
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="username" className="text-gray-700">
              Tên đăng nhập
            </Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nhập username"
              className="mt-1 bg-white/60 border-indigo-300 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 bg-white/60 border-indigo-300 focus:ring-indigo-400"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all shadow-md"
          >
            Đăng nhập
          </Button>
        </form>

        <p className="mt-5 text-center text-gray-700">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
