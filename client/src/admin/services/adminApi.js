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
  getPendingFlashSales: () => apiClient.get("/api/admin/flash-sales/pending"),

  approveFlashSale: (id) =>
    apiClient.put(`/api/admin/flash-sales/approve/${id}`),

  rejectFlashSale: (id) => apiClient.put(`/api/admin/flash-sales/reject/${id}`),

  // ================= CATEGORIES =================
  // Lưu ý: Dựa trên router.post("/categories") -> URL là /api/admin/categories
  createCategory: (data) => apiClient.post("/api/admin/categories", data), // data = FormData hoặc JSON

  deleteCategory: (id) => apiClient.delete(`/api/admin/categories/${id}`),

  // ================= USERS / SELLERS =================
  getUsers: (params) => apiClient.get("/api/admin/users", { params }), // params: { role: 'seller' }

  approveSeller: (id) => apiClient.put(`/api/admin/users/${id}/approve`),

  banUser: (id) => apiClient.put(`/api/admin/users/${id}/ban`),

  unbanUser: (id) => apiClient.put(`/api/admin/users/${id}/unban`),
  // ================= ADMIN ACCOUNT =================
  createAdmin: (data) => apiClient.post("/api/admin/create", data),
};

export default adminApi;
