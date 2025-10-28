import { useState, useEffect } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();

      const processedProducts = data.map((product) => ({
        ...product,
        id: product._id,
        stock: product.stock || 0,
        sales: product.sales || 0,
        status: product.status || "active",
      }));

      setProducts(processedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (res.ok) {
        const newProductWithId = {
          ...data.product,
          id: data.product._id,
          stock: data.product.stock || 0,
          sales: data.product.sales || 0,
        };

        setProducts((prev) => [newProductWithId, ...prev]);
        return { success: true, message: "✅ Thêm sản phẩm thành công!" };
      } else {
        return {
          success: false,
          message: "❌ Lỗi: " + (data.message || "Không thể thêm sản phẩm"),
        };
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      return { success: false, message: "❌ Không thể kết nối server." };
    }
  };
  // Thêm hàm deleteProduct
  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.message || "Không thể xóa sản phẩm",
        };
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      return { success: false, message: "❌ Không thể kết nối server." };
    }
  };

  const updateProduct = async (productId, updateData) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...data.product, id: data.product._id } : p
          )
        );
        return { success: true };
      } else {
        return { success: false, message: "❌ Không thể cập nhật" };
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      return { success: false, message: "❌ Không thể kết nối server." };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setProducts,
  };
};
