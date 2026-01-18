import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowLeft, ShoppingBag } from "lucide-react"; // 🔥 Thêm icon

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form.username, form.password);
      if (result && result.success) {
        toast.success("Đăng nhập thành công!");
        window.location = result.redirectTo || "/seller";
        return;
      } else {
        toast.error(result?.error || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] p-4 relative">
      {/* 🔥 NÚT 1: Quay lại trang chủ ở góc trái (Tuyệt đẹp cho UI) */}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Quay lại trang chủ
      </Link>

      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <ShoppingBag className="text-indigo-600" size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 drop-shadow-sm">
          Chào mừng trở lại
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Vui lòng đăng nhập để tiếp tục trải nghiệm
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="username">Username / Email</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 bg-white/60 border-indigo-200 focus:ring-indigo-400 h-11"
              required
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 bg-white/60 border-indigo-200 focus:ring-indigo-400 h-11"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 rounded-xl transition-all shadow-lg shadow-indigo-100"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
          </Button>
        </form>

        <div className="mt-8 space-y-4">
          <p className="text-center text-gray-600 text-sm">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:underline font-bold"
            >
              Đăng ký ngay
            </Link>
          </p>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">
              Hoặc
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* 🔥 NÚT 2: Xem sản phẩm không cần đăng nhập */}
          <Link
            to="/products"
            className="block text-center w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-all text-sm"
          >
            Khám phá sản phẩm ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
