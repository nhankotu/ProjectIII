import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import apiClient, { userAPI } from "../customer/services/api";

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

  // 1. Cập nhật User State & LocalStorage
  const updateUser = useCallback((userData) => {
    setUser((prevUser) => {
      // Đảm bảo lấy đúng object user nếu backend bọc nó
      const cleanData = userData.user || userData;
      const newUser = { ...prevUser, ...cleanData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  // 2. Hàm lấy profile khi reload (F5)
  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();

      // 🔥 SỬA: Bóc tách đúng object user từ response của Axios
      // Nếu backend trả về { success: true, user: {...} }
      // hoặc trả về trực tiếp {...}
      const userData =
        response.user || response.data?.user || response.data || response;

      if (userData && (userData._id || userData.id)) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
      return userData;
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
      // Chỉ logout nếu thực sự lỗi 401 hoặc 403 (Token hỏng)
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token) {
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem("user");
        }
      }
      // Fetch bản mới nhất từ server để cập nhật lại state
      fetchUserProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post("/api/users/login", {
        username,
        password,
      });

      const data = response.data || response;
      const token = data.token || data.accessToken;
      const userData = data.user;
      const redirectTo = data.redirectTo;

      if (!token) throw new Error("Không tìm thấy token!");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData, redirectTo };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Đăng nhập thất bại";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // Dùng window.location để xóa sạch state cũ của toàn app
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      updateUser,
      isAuthenticated: !!user,
    }),
    [user, loading, error, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
