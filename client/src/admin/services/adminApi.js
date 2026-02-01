import apiClient from "./api"; // Import axios instance đã có token

const adminApi = {
  // ================= DASHBOARD & PRODUCTS =================
  getProductStats: () => apiClient.get("/api/admin/products/stats"),

  getProducts: (params) => apiClient.get("/api/admin/products", { params }),

  getProductDetail: (id) => apiClient.get(`/api/admin/products/${id}`),

  // Update status (Duyệt/Cấm): PUT /api/admin/products/:id/status
  updateProductStatus: (id, status, reason) =>
    apiClient.put(`/api/admin/products/${id}/status`, { status, reason }),

  // Soft Delete: DELETE /api/admin/products/:id
  deleteProduct: (id) => apiClient.delete(`/api/admin/products/${id}`),

  // ================= FLASH SALES =================
  // 1. Lấy danh sách sản phẩm chờ duyệt
  getPendingFlashSales: () => apiClient.get("/api/admin/flash-sales/pending"),

  // 2. Duyệt sản phẩm (Gửi object thay vì ID trên URL để khớp logic mới)
  approveFlashSale: (payload) =>
    apiClient.post("/api/admin/flash-sales/approve", payload),

  // 3. Từ chối sản phẩm
  rejectFlashSale: (payload) =>
    apiClient.post("/api/admin/flash-sales/reject", payload),

  // 4. Lấy danh sách tất cả khung giờ
  getAllSessions: () => apiClient.get("/api/admin/flash-sales/sessions"),

  // 5. Tạo khung giờ mới (Hỗ trợ FormData cho Banner)
  createFlashSaleSession: (data) =>
    apiClient.post("/api/admin/flash-sales/sessions", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  // ================= CATEGORIES =================
  // Lưu ý: Dựa trên router.post("/categories") -> URL là /api/admin/categories
  // adminApi.js
  createCategory: (data) => {
    // Kiểm tra nếu data là FormData (có chứa file)
    if (data instanceof FormData) {
      return apiClient.post("/api/admin/categories", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    // Nếu chỉ là JSON thông thường
    return apiClient.post("/api/admin/categories", data);
  },
  getAdminCategory: () => apiClient.get("/api/admin/categories/tree"),
  deleteCategory: (id) => apiClient.delete(`/api/admin/categories/${id}`),

  // ================= USERS / SELLERS =================
  getUsers: (params) => apiClient.get("/api/admin/users", { params }), // params: { role: 'seller' }

  approveSeller: (id) => apiClient.put(`/api/admin/users/${id}/approve`),

  banUser: (id) => apiClient.put(`/api/admin/users/${id}/ban`),

  unbanUser: (id) => apiClient.put(`/api/admin/users/${id}/unban`),
  // ================= ADMIN ACCOUNT =================
  createAdmin: (data) => apiClient.post("/api/admin/create", data),
  // ================= REVENUE =================
  // 1. Thống kê tổng quan sàn (GMV, Phí sàn, Biểu đồ)
  getPlatformRevenue: (params) =>
    apiClient.get("/api/admin/revenue/platform", { params }), // params: { range: 'week' }

  // 2. Thống kê doanh thu theo từng shop
  getShopsRevenue: (params) =>
    apiClient.get("/api/admin/revenue/shops", { params }),
};

export default adminApi;
