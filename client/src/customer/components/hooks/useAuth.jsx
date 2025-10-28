import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra cả localStorage VÀ server session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        // Ưu tiên kiểm tra server session trước
        try {
          const response = await fetch("/api/auth/check", {
            method: "GET",
            credentials: "include", // Quan trọng: gửi session cookie
          });

          if (response.ok) {
            const serverUser = await response.json();
            console.log("User authenticated by server:", serverUser);

            // Đồng bộ với localStorage
            localStorage.setItem("user", JSON.stringify(serverUser));
            setUser(serverUser);
            setLoading(false);
            return;
          }
        } catch (serverError) {
          console.log("Server auth check failed, falling back to localStorage");
        }

        // Fallback: kiểm tra localStorage
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log("Using user from localStorage:", parsedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Hàm login thật - gọi API server
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();

        // Lưu thông tin user
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);

        return { success: true, user: result.user };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || "Đăng nhập thất bại" };
      }
    } catch (error) {
      return { success: false, error: "Lỗi kết nối" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Gọi API logout server
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
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
