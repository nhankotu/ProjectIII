import axios from "axios";

// ============================================================
// 1. CẤU HÌNH AXIOS CLIENT (Dùng chung cho cả app)
// ============================================================
const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
});

// --- Interceptor: Tự động gắn Token ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- Interceptor: Xử lý lỗi chung (VD: 401) ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic logout nếu cần
    }
    return Promise.reject(error);
  },
);

// ============================================================
// 2. HELPER FUNCTION (Nội bộ)
// ============================================================
const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (key === "newImages" && Array.isArray(value)) {
      value.forEach((file) => formData.append("images", file));
    } else if (key === "videos" && Array.isArray(value)) {
      value.forEach((file) => formData.append("videos", file));
    } else if (
      [
        "shipping",
        "variants",
        "variantAttributes",
        "specifications",
        "tags",
        "deletedImages",
      ].includes(key)
    ) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

// ============================================================
// 3. CÁC EXPORT CONST (API ENDPOINTS)
// ============================================================

// ============================================================
// Sản phẩm
// ============================================================
export const productApi = {
  getAll: async (params = {}) => {
    const res = await apiClient.get("/api/seller/products", { params });
    return res.data;
  },

  getDetail: async (id) => {
    const res = await apiClient.get(`/api/seller/products/${id}`);
    return res.data;
  },

  create: async (data) => {
    const formData = createFormData(data);
    const res = await apiClient.post("/api/seller/products", formData);
    return res.data;
  },

  update: async (id, data) => {
    const formData = createFormData(data);
    const res = await apiClient.put(`/api/seller/products/${id}`, formData);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/api/seller/products/${id}`);
    return res.data;
  },
};
// ============================================================
// Danh mục
// ============================================================
export const categoryApi = {
  getSellerCategories: async () => {
    const res = await apiClient.get("/api/seller/categories");
    return res.data;
  },

  getDetail: async (id) => {
    const res = await apiClient.get(`/api/seller/categories/${id}`);
    return res.data;
  },
};

// ============================================================
//  FLASH SALE
// ============================================================

export const flashSaleApi = {
  getSellerFlashSales: async () => {
    const res = await apiClient.get("/api/seller/flash-sales");
    return res.data;
  },

  getAvailable: async () => {
    const res = await apiClient.get("/api/seller/flash-sales/available");
    return res.data;
  },

  register: async (data) => {
    const res = await apiClient.post("/api/seller/flash-sales/register", data);
    return res.data;
  },
};
// ============================================================
// ORDER API
// ============================================================
export const orderApi = {
  // Lấy danh sách (Hỗ trợ params: page, limit, status)
  getAll: async (params = {}) => {
    const res = await apiClient.get("/api/seller/orders", { params });
    return res.data;
  },

  // Cập nhật trạng thái
  updateStatus: async (id, status) => {
    const res = await apiClient.put(`/api/seller/orders/${id}`, { status });
    return res.data;
  },

  // (Optional) Lấy chi tiết đơn hàng
  getDetail: async (id) => {
    const res = await apiClient.get(`/api/seller/orders/${id}`);
    return res.data;
  },
  getStats: async () => {
    const res = await apiClient.get("/api/seller/orders/stats");
    return res.data;
  },
};

// ============================================================
// inventory
// ============================================================
export const inventoryApi = {
  // Lấy danh sách sản phẩm (Inventory)
  getProducts: async () => {
    const response = await apiClient.get("/api/seller/products");
    return response.data;
  },

  // Cập nhật tồn kho
  updateStock: async (id, stock) => {
    const response = await apiClient.put(`/api/seller/products/${id}`, {
      stock,
    });
    return response.data;
  },
};
// ============================================================
// financial
// ============================================================
export const financialApi = {
  getOverview: async (timeRange = "month") => {
    const response = await apiClient.get("/api/seller/financial/overview", {
      params: { range: timeRange },
    });
    return response.data;
  },
};
// ============================================================
// Chat
// ============================================================

export const chatApi = {
  // 1. Lấy danh sách hội thoại
  getConversations: () => {
    return apiClient.get("/api/seller/chat/conversations");
  },

  // 2. Lấy tin nhắn của 1 hội thoại
  getMessages: (conversationId) => {
    return apiClient.get(`/api/seller/chat/messages/${conversationId}`);
  },

  // 3. Gửi tin nhắn (Xử lý FormData tại đây cho gọn hook)
  sendMessage: (conversationId, text, files = [], productId = null) => {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("text", text || "");

    if (productId) {
      formData.append("productId", productId);
    }

    // Append các file vào key "images"
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    return apiClient.post("/api/seller/chat/message", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 4. Đánh dấu đã đọc
  markAsRead: (conversationId) => {
    return apiClient.put("/api/seller/chat/read", { conversationId });
  },
};

// ============================================================
// DASHBOARD API
// ============================================================
export const dashboardApi = {
  getSummary: async () => {
    const res = await apiClient.get("/api/seller/dashboard/summary");
    return res.data; // Trả về object chứa { success, data }
  },
};

// review
export const reviewApi = {
  getProductReviews: (productId) =>
    apiClient.get(`/api/seller/products/${productId}/reviews`),
  replyReview: (reviewId, data) =>
    apiClient.post(`/api/seller/reviews/${reviewId}/reply`, data),
};
