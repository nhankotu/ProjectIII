import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Đảm bảo đúng biến môi trường Vite
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Tự động gắn Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý data và lỗi
apiClient.interceptors.response.use(
  (response) => response.data, // ✅ Trả về data trực tiếp, bỏ qua lớp vỏ axios
  (error) => {
    // Xử lý lỗi 401: Hết hạn token
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    // Trả về lỗi clean để component hiển thị
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export default apiClient;
