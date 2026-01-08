import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import apiClient, { userAPI } from "../customer/services/api"; // Đảm bảo đường dẫn đúng

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy profile (dùng khi F5 trang)
  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      // Kiểm tra cấu trúc trả về, userAPI thường trả về { data: user } hoặc user trực tiếp
      const userData = response.data || response;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // --- HÀM LOGIN ĐÃ SỬA ---
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Gọi API Login
      const response = await apiClient.post("/api/users/login", {
        username,
        password,
      });

      // 2. Lấy dữ liệu từ response (Backend trả về: token, user, redirectTo)
      // Lưu ý: apiClient (axios) thường trả dữ liệu trong response.data,
      // nhưng nếu bạn đã cấu hình interceptor để return response.data thì dùng trực tiếp 'response'
      const data = response.data || response;

      const token = data.token || data.accessToken;
      const userData = data.user; // Backend trả về object user
      const redirectTo = data.redirectTo; // Backend trả về đường dẫn gợi ý

      if (!token) throw new Error("Không tìm thấy token!");

      // 3. Lưu token & cập nhật State ngay lập tức
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // 4. ✅ QUAN TRỌNG: Return dữ liệu ra để Login.jsx sử dụng
      return {
        success: true,
        user: userData, // Để Login.jsx check role
        redirectTo: redirectTo, // Để Login.jsx navigate theo backend
      };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Đăng nhập thất bại";
      setError(message);

      // Return lỗi để Login.jsx hiển thị
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, error]
    // Lưu ý: Bỏ login/logout khỏi dependency array nếu ko dùng useCallback,
    // tránh re-render ko cần thiết, hoặc user/loading thay đổi là đủ trigger rồi.
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
