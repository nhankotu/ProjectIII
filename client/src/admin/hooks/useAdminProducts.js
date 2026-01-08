import { useState, useCallback } from "react";
import { toast } from "sonner";
import adminApi from "../services/adminApi";

export const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchProducts = useCallback(async (params) => {
    try {
      setLoading(true);
      const res = await adminApi.getProducts(params);
      setProducts(res.data.data); // hoặc res.data.products tùy backend trả về
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Lỗi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id, status, reason) => {
    try {
      await adminApi.updateProductStatus(id, status, reason);
      toast.success(`Đã cập nhật: ${status}`);
      return true;
    } catch (err) {
      toast.error("Lỗi cập nhật trạng thái");
      return false;
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success("Đã xóa sản phẩm");
      return true;
    } catch (err) {
      toast.error("Lỗi xóa sản phẩm");
      return false;
    }
  };

  return {
    products,
    loading,
    pagination,
    fetchProducts,
    updateStatus,
    deleteProduct,
  };
};
