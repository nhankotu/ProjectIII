import { useState, useEffect } from "react";

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock products
      const mockProducts = generateMockProducts(20);

      // Apply filters
      let filteredProducts = [...mockProducts];

      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category?.slug === filters.category
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand?.toLowerCase().includes(searchTerm) ||
            product.category?.name.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= filters.minPrice
        );
      }

      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= filters.maxPrice
        );
      }

      if (filters.sortBy) {
        filteredProducts = sortProducts(filteredProducts, filters.sortBy);
      }

      setProducts(filteredProducts);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm");
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters.category, filters.search, filters.sortBy]);

  const getProductById = (id) => {
    return products.find((product) => product.id === parseInt(id));
  };

  const getProductsByCategory = (categorySlug) => {
    return products.filter(
      (product) => product.category?.slug === categorySlug
    );
  };

  const getFeaturedProducts = () => {
    return products.filter((product) => product.isFeatured).slice(0, 8);
  };

  const getRelatedProducts = (productId, limit = 4) => {
    const product = getProductById(productId);
    if (!product) return [];

    return products
      .filter(
        (p) => p.id !== productId && p.category?.slug === product.category?.slug
      )
      .slice(0, limit);
  };

  return {
    products,
    loading,
    error,
    refetch: () => fetchProducts(filters),
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getRelatedProducts,
  };
};

// Helper functions
const generateMockProducts = (count) => {
  const categories = [
    { id: 1, name: "Điện Thoại", slug: "dien-thoai" },
    { id: 2, name: "Laptop", slug: "laptop" },
    { id: 3, name: "Tablet", slug: "tablet" },
    { id: 4, name: "Phụ Kiện", slug: "phu-kien" },
  ];

  const brands = ["Apple", "Samsung", "Xiaomi", "Oppo", "Dell", "HP", "Lenovo"];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Sản phẩm ${index + 1}`,
    price: Math.floor(Math.random() * 10000000) + 1000000,
    originalPrice: Math.floor(Math.random() * 12000000) + 1200000,
    images: [`https://picsum.photos/300/300?random=${index + 1}`],
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviewCount: Math.floor(Math.random() * 100),
    soldCount: Math.floor(Math.random() * 500),
    description: `Mô tả chi tiết cho sản phẩm ${
      index + 1
    }. Đây là sản phẩm chất lượng cao với nhiều tính năng hiện đại.`,
    shortDescription: `Mô tả ngắn cho sản phẩm ${index + 1}`,
    inStock: Math.random() > 0.1,
    isFeatured: Math.random() > 0.7,
    stock: Math.floor(Math.random() * 100) + 10,
    maxQuantity: 10,
    slug: `san-pham-${index + 1}`,
  }));
};

const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "rating_desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort((a, b) => b.id - a.id);
    case "best_seller":
      return sorted.sort((a, b) => b.soldCount - a.soldCount);
    default:
      return sorted;
  }
};
