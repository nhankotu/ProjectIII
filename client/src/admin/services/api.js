import axios from "axios";

// 1. Cấu hình URL Backend
// Nếu bạn dùng Vite thì dùng import.meta.env.VITE_API_URL
// Nếu dùng Create React App thì dùng process.env.REACT_APP_API_URL
// Hoặc hardcode localhost nếu đang dev
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 2. Tạo Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000, // Timeout sau 20s nếu mạng quá lag
});

// ============================================================
// 3. REQUEST INTERCEPTOR (Quan trọng nhất)
// Tác dụng: Trước khi gửi request đi, tự động chèn Token vào Header
// ============================================================
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ LocalStorage (Key phải khớp với lúc Login bạn lưu)
    const token = localStorage.getItem("token");

    if (token) {
      // Gắn vào header: Authorization: Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// 4. RESPONSE INTERCEPTOR
// Tác dụng: Xử lý phản hồi trả về từ server trước khi đến component
// ============================================================
apiClient.interceptors.response.use(
  (response) => {
    // Trả về toàn bộ response (bao gồm data, status, headers...)
    return response;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response) {
      // Ví dụ: Nếu server trả về 401 (Unauthorized) -> Token hết hạn hoặc không hợp lệ
      if (error.response.status === 401) {
        // Có thể comment dòng dưới nếu muốn tự xử lý ở component
        // console.warn("Token hết hạn hoặc không hợp lệ. Đang logout...");
        // Tùy chọn: Xóa token và đá về trang login (cẩn thận vòng lặp vô tận)
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// 5. ĐỊNH NGHĨA CÁC API RIÊNG LẺ (Optional)
// Bạn có thể viết các hàm gọi API User ở đây hoặc tách ra file userApi.js
// ============================================================
export const userAPI = {
  // Đăng nhập
  login: (credentials) => apiClient.post("/api/users/login", credentials),

  // Đăng ký
  register: (data) => apiClient.post("/api/users/register", data),

  // Lấy thông tin profile (Cần token - Interceptor sẽ tự lo)
  getProfile: () => apiClient.get("/api/users/profile"),

  // Cập nhật profile
  updateProfile: (data) => apiClient.put("/api/users/profile", data),
};

export default apiClient;
