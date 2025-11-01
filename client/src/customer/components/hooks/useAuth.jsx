import { useState, useEffect, createContext, useContext } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        console.log("🔄 Checking auth...");
        console.log("📝 Token from localStorage:", token ? "Exists" : "Null");

        // Nếu có token → verify với server
        if (token) {
          try {
            console.log("🔄 Verifying token with server...");
            const response = await fetch(`${API_BASE}/api/users/check`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            console.log("📡 Server response status:", response.status);

            if (response.ok) {
              const serverData = await response.json();
              console.log(
                "✅ Server auth success - User:",
                serverData.user.username
              );

              // Dùng user thật từ server
              setUser(serverData.user);
              localStorage.setItem("user", JSON.stringify(serverData.user));
            } else {
              // Token không valid → clear everything
              console.log("❌ Token invalid, clearing auth data");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
            }
          } catch (serverError) {
            console.error("🚨 Server auth error:", serverError);
            // Lỗi kết nối → vẫn dùng localStorage nếu có
            if (userData) {
              console.log("🔄 Using localStorage due to connection error");
              setUser(JSON.parse(userData));
            }
          }
        } else {
          // Không có token → không đăng nhập
          console.log("❌ No token found");
          setUser(null);
        }
      } catch (error) {
        console.error("🚨 Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
  // Hàm login - cập nhật để lưu token
  const login = async (username, password) => {
    try {
      setLoading(true);

      console.log("🔍 DEBUG - Login API URL:", `${API_BASE}/api/users/login`);

      const response = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("🔍 DEBUG - Login response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("🔍 DEBUG - Login success:", result);

        // LƯU TOKEN VÀ USER
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);

        return { success: true, user: result.user };
      } else {
        const error = await response.json();
        console.log("🔍 DEBUG - Login error:", error);
        return { success: false, error: error.message || "Đăng nhập thất bại" };
      }
    } catch (error) {
      console.error("🔍 DEBUG - Login connection error:", error);
      return { success: false, error: "Lỗi kết nối" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Gọi API logout nếu có token
      if (token) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear client state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
