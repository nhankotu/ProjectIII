import { useState, useEffect } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockProducts = [
        {
          id: 1,
          name: "Áo thun nam cổ tròn",
          price: 150000,
          stock: 45,
          category: "Thời trang",
          status: "active",
          sales: 23,
          images: ["https://via.placeholder.com/300x300?text=Áo+Thun+1"],
          videos: [],
          description: "Áo thun nam chất liệu cotton mềm mại",
          createdAt: "2024-09-15",
        },
        {
          id: 2,
          name: "Quần jeans nữ",
          price: 350000,
          stock: 12,
          category: "Thời trang",
          status: "active",
          sales: 15,
          images: ["https://via.placeholder.com/300x300?text=Quần+Jeans"],
          videos: [],
          description: "Quần jeans nữ form slim fit",
          createdAt: "2024-09-20",
        },
      ];

      setProducts(mockProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (newProduct) => {
    const product = {
      id: products.length + 1,
      ...newProduct,
      sales: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (productId, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedData } : p))
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
