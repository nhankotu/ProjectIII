import { useState, useCallback, useEffect } from "react";
// Import các hàm API đã viết trong file api.js
import { productApi, categoryApi } from "../services/api";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================================
  // 1. LẤY DANH SÁCH SẢN PHẨM
  // ============================================================
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi hàm từ api.js (Đã bao gồm cấu hình axios & token)
      const data = await productApi.getAll();

      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message || "Không thể tải danh sách sản phẩm");
      }
    } catch (err) {
      // Axios thường trả về lỗi trong err.response
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi API ngay khi component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ============================================================
  // 2. THÊM SẢN PHẨM
  // ============================================================
  const addProduct = async (productData) => {
    setLoading(true);
    try {
      // KHÔNG CẦN gọi createFormData ở đây nữa
      // File api.js đã tự lo liệu việc convert sang FormData
      const data = await productApi.create(productData);

      if (data.success) {
        // Cập nhật state local ngay lập tức để UI mượt mà
        setProducts((prev) => [data.data, ...prev]);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 3. CẬP NHẬT SẢN PHẨM
  // ============================================================
  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const data = await productApi.update(id, productData);

      if (data.success) {
        // Tìm và thay thế item cũ bằng item mới trong state
        setProducts((prev) =>
          prev.map((item) => (item._id === id ? data.data : item)),
        );
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 4. XÓA SẢN PHẨM
  // ============================================================
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      const data = await productApi.delete(id);

      if (data.success) {
        // Lọc bỏ item đã xóa khỏi state
        setProducts((prev) => prev.filter((item) => item._id !== id));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 5. LẤY DANH MỤC (Dùng cho dropdown chọn danh mục)
  // ============================================================
  const getCategories = useCallback(async () => {
    try {
      const data = await categoryApi.getSellerCategories();
      if (data.success) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
      return [];
    }
  }, []);

  // Trả về các state và function để Component sử dụng
  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    refreshProducts: fetchProducts,
  };
};
