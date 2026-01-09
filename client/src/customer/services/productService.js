import apiClient from "./api";

export const productService = {
  getProducts: (params = {}) => {
    return apiClient.get("/api/products", { params });
  },

  getProductById: (id) => {
    return apiClient.get(`/api/products/${id}`);
  },

  getFeaturedProducts: () => {
    return apiClient.get("/api/products/featured");
  },

  getFlashSaleProducts: () => {
    return apiClient.get("/api/flash-sales/active");
  },

  searchProducts: (query, params = {}) => {
    return apiClient.get("/api/products", {
      params: { search: query, ...params },
    });
  },

  getCategories: () => {
    return apiClient.get("/api/categories");
  },

  getProductsByCategory: (categorySlug, params = {}) => {
    return apiClient.get("/api/products", {
      params: { categorySlug, ...params },
    });
  },
};
