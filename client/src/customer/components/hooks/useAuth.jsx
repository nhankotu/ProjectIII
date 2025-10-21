import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Mock login API call
      const mockUser = {
        id: 1,
        email: email,
        name: "Nguyễn Văn A",
        phone: "0123456789",
        avatar: "/images/avatar-default.jpg",
        addresses: [
          {
            id: 1,
            name: "Nhà riêng",
            phone: "0123456789",
            address: "123 Trần Duy Hưng, Trung Hoà, Cầu Giấy, Hà Nội",
            isDefault: true,
          },
        ],
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      const token = "mock-jwt-token";
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: "Đăng nhập thất bại" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      // Mock register API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Auto login after register
      return await login(userData.email, userData.password);
    } catch (error) {
      return { success: false, error: "Đăng ký thất bại" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      // Mock update API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: "Cập nhật thất bại" };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
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
