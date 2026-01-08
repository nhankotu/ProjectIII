import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  // Fetch products
  const fetchProducts = useCallback(
    async (customFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const allFilters = { ...filters, ...customFilters };
        const response = await productService.getProducts(allFilters);

        setProducts(response.data || response);
        setPagination(
          response.pagination || {
            page: 1,
            limit: 12,
            total: response.length || 0,
            pages: 1,
          }
        );
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Change page
  const changePage = useCallback(
    (page) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  return {
    products,
    loading,
    error,
    filters,
    pagination,
    fetchProducts,
    updateFilters,
    resetFilters,
    changePage,
  };
};
