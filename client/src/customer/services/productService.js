// LƯU Ý: Kiểm tra xem file cấu hình axios của bạn tên là "api.js" hay "apiClient.js"
// Nếu là "api.js" thì sửa dòng dưới thành: import apiClient from "./api";
import apiClient from "./api";

export const productService = {
  // Get all products with filters
  getProducts: (params = {}) => {
    // SỬA: Thêm /api vào trước
    return apiClient.get("/api/products", { params });
  },

  // Get single product by ID
  getProductById: (id) => {
    return apiClient.get(`/api/products/${id}`);
  },

  // Get featured products
  getFeaturedProducts: () => {
    return apiClient.get("/api/products/featured");
  },

  // Get flash sale products
  getFlashSaleProducts: () => {
    return apiClient.get("/api/flash-sales/active");
  },

  // Search products
  searchProducts: (query, params = {}) => {
    return apiClient.get("/api/products/search", {
      params: { q: query, ...params },
    });
  },

  // Get product categories
  getCategories: () => {
    return apiClient.get("/api/categories");
  },

  // Get products by category
  getProductsByCategory: (categorySlug, params = {}) => {
    return apiClient.get(`/api/categories/${categorySlug}/products`, {
      params,
    });
  },

  // Get related products
  getRelatedProducts: (productId) => {
    return apiClient.get(`/api/products/${productId}/related`);
  },
};
