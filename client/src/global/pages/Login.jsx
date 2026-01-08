import React, { useState } from "react";
import { Link } from "react-router-dom"; // Bỏ useNavigate vì không dùng nữa
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  // Không cần const navigate = useNavigate(); nữa
  const { login } = useAuth(); // Không cần lấy biến 'user' ở đây nữa

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(form.username, form.password);

      console.log("FULL RESULT:", result);

      if (result && result.success) {
        toast.success("Đăng nhập thành công!");

        // CÁCH ĐƠN GIẢN NHẤT - KHÔNG TIMEOUT
        const redirectPath = result.redirectTo || "/seller";
        console.log("Redirecting to:", redirectPath);

        // Dùng cách cơ bản nhất
        window.location = redirectPath;

        // Hoặc nếu vẫn không được
        // window.location.href = redirectPath;

        // IMPORTANT: Return ngay lập tức
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6 drop-shadow-sm">
          Đăng nhập tài khoản
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="username">Username / Email</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 bg-white/60 border-indigo-300 focus:ring-indigo-400"
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
              className="mt-1 bg-white/60 border-indigo-300 focus:ring-indigo-400"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all shadow-md"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
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
