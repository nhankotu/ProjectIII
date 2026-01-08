import { useState, useCallback } from "react";
import { toast } from "sonner";
import adminApi from "../services/adminApi";
import apiClient from "../services/api"; // Dùng cái này để lấy list public

export const useAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách (Thường là API public, hoặc adminApi nếu bạn làm riêng)
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      // Giả sử lấy list category là public route
      const res = await apiClient.get("/api/categories");
      setCategories(res.data.data || res.data);
    } catch (err) {
      toast.error("Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (formData) => {
    try {
      await adminApi.createCategory(formData);
      toast.success("Tạo danh mục thành công");
      fetchCategories();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tạo danh mục");
      return false;
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success("Đã xóa danh mục");
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error("Lỗi xóa danh mục");
    }
  };

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    deleteCategory,
  };
};
