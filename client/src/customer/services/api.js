import axios from "axios";

// 1. CẤU HÌNH CHUNG
// Sử dụng import.meta.env vì đây là dự án Vite (dựa trên code cũ của bạn)
const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout sau 10 giây
});

// 2. INTERCEPTORS (Bộ đón chặn)

// Request: Tự động gắn Token vào mọi request
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

// Response: Xử lý dữ liệu trả về và lỗi Token hết hạn (401)
apiClient.interceptors.response.use(
  (response) => response.data, // Trả về thẳng data, bỏ qua lớp vỏ axios
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Chỉ redirect nếu không phải đang ở trang login để tránh lặp vô tận
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    // Trả về lỗi gọn gàng để hiển thị thông báo
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

// --- 3. ĐỊNH NGHĨA CÁC NHÓM API ---

// ➤ PRODUCT API (Gộp từ File 1 và File 2)
export const productAPI = {
  getAll: (params) => apiClient.get("/api/products", { params }),
  getById: (id) => apiClient.get(`/api/products/${id}`),

  // Các nhóm sản phẩm đặc biệt
  getFeatured: () => apiClient.get("/api/products/featured"),
  getFlashSale: () => apiClient.get("/api/products/flash-sale"),
  getHot: () => apiClient.get("/api/products/hot"),

  // Tìm kiếm & Danh mục
  search: (query, params) =>
    apiClient.get("/api/products/search", { params: { q: query, ...params } }),
  getByCategory: (slug, params) =>
    apiClient.get(`/api/categories/${slug}/products`, { params }),
  getCategories: () => apiClient.get("/api/categories"),

  // Bổ sung từ file cũ: Sản phẩm liên quan
  getRelated: (categoryId) =>
    apiClient.get("/api/products", {
      params: { category: categoryId, limit: 5 },
    }),
};

// ➤ SHOP API (Bổ sung từ file cũ)
export const shopAPI = {
  getPublicInfo: (id) => apiClient.get(`/api/shop/${id}`),
};

// ➤ CART API (Lấy từ File 1)
export const cartAPI = {
  getCart: () => apiClient.get("/api/cart"),

  addToCart: (data) => apiClient.post("/api/cart/add", data),

  updateCartItem: (data) => apiClient.put("/api/cart/update", data),

  removeFromCart: (itemId) => apiClient.delete(`/api/cart/remove/${itemId}`),

  clearCart: () => apiClient.delete("/api/cart"),
};

// ➤ USER API (Gộp User + Address + Avatar từ File 3 nhưng chuyển sang axios)
export const userAPI = {
  // Profile
  getProfile: () => apiClient.get("/api/users/profile"),
  updateProfile: (data) => apiClient.put("/api/users/profile", data),

  // Upload Avatar (Chuyển từ fetch sang axios multipart)
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient.post("/api/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Address (Địa chỉ)
  getAddresses: () => apiClient.get("/api/users/address"), // Lưu ý: Check lại backend dùng 'address' hay 'addresses'
  addAddress: (data) => apiClient.post("/api/users/address", data),
  updateAddress: (id, data) => apiClient.put(`/api/users/address/${id}`, data),
  deleteAddress: (id) => apiClient.delete(`/api/users/address/${id}`),
  setDefaultAddress: (id) => apiClient.put(`/api/users/address/${id}/default`),
};

// ➤ ORDER API (Gộp logic từ File 1 và File 3)
export const orderAPI = {
  createOrder: (data) => apiClient.post("/api/order", data),

  getMyOrders: () => apiClient.get("/api/order"),

  getOrderById: (id) => apiClient.get(`/api/order/${id}`),

  cancelOrder: (id, reason) =>
    apiClient.patch(`/api/order/${id}/cancel`, { reason }),
  upsertReview: (data) => apiClient.put("/api/reviews", data),
  deleteReview: (id) => apiClient.delete(`/api/reviews/${id}`),
};

export default apiClient;
