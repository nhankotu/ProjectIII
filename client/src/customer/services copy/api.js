// services/api.js
import axios from "axios";

// 1. CẤU HÌNH BASE URL: Để về root server, không thêm /api ở đây để tránh trùng lặp
const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Gắn token
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

// Interceptor: Xử lý lỗi 401
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// --- ĐỊNH NGHĨA API CHUẨN ---

// Product API
export const productAPI = {
  getAll: (params) => apiClient.get("/api/products", { params }),
  getFeatured: () => apiClient.get("/api/products/featured"), // API Sản phẩm nổi bật
  getFlashSale: () => apiClient.get("/api/products/flash-sale"), // API Flash sale
  getHot: () => apiClient.get("/api/products/hot"), // API Sản phẩm hot
  getById: (id) => apiClient.get(`/api/products/${id}`),
  getByCategory: (slug, params) =>
    apiClient.get(`/api/categories/${slug}/products`, { params }),
  search: (query, params) =>
    apiClient.get("/api/products/search", { params: { q: query, ...params } }),

  // Categories
  getCategories: () => apiClient.get("/api/categories"),
};

// Cart API
export const cartAPI = {
  getCart: () => apiClient.get("/api/cart"),
  addToCart: (productId, quantity) =>
    apiClient.post("/api/cart/items", { productId, quantity }),
  updateCartItem: (itemId, quantity) =>
    apiClient.put(`/api/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => apiClient.delete(`/api/cart/items/${itemId}`),
  clearCart: () => apiClient.delete("/api/cart"),
};

// User API
export const userAPI = {
  getProfile: () => apiClient.get("/api/users/profile"),
  updateProfile: (data) => apiClient.put("/api/users/profile", data),
  getOrders: () => apiClient.get("/api/users/me/orders"),
  // 1. Lấy danh sách (đã làm ở bước trước)
  getAddresses: () => apiClient.get("/api/users/address"),

  // 2. Thêm mới
  addAddress: (data) => apiClient.post("/api/users/address", data),

  // 4. Xóa
  deleteAddress: (id) => apiClient.delete(`/api/users/address/${id}`),

  // 5. Đặt mặc định
  setDefaultAddress: (id) => apiClient.put(`/api/users/address/${id}/default`),

  // 6. Cập nhật profile chung (tên, sđt chính...)
  updateProfile: (data) => apiClient.put("/api/users/profile", data),
};
export const orderAPI = {
  // Tạo đơn hàng mới
  createOrder: (data) => apiClient.post("/api/orders", data),

  // Lấy danh sách đơn hàng của tôi
  getMyOrders: () => apiClient.get("/api/orders/my-orders"),

  // Lấy chi tiết đơn hàng
  getOrderById: (id) => apiClient.get(`/api/orders/${id}`),

  // Hủy đơn hàng (nếu cần)
  cancelOrder: (id, reason) =>
    apiClient.put(`/api/orders/${id}/cancel`, { reason }),
};
// Hàm apiGet tổng quát (nếu cần dùng lẻ)
export const apiGet = (url, params) => apiClient.get(url, { params });

export default apiClient;
