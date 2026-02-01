import { useState, useCallback } from "react";
import { toast } from "sonner";
import adminApi from "../services/adminApi";
import Swal from "sweetalert2";

// ✅ HELPER: Flatten the tree structure into a list with levels
const flattenCategories = (categories, level = 0) => {
  let result = [];

  categories.forEach((cat) => {
    // Create a display name with indentation (e.g., "— — Laptop")
    const prefix = level > 0 ? "— ".repeat(level) : "";
    const displayName = prefix + cat.name;

    result.push({
      ...cat,
      level: level, // Store level for styling
      displayName: displayName, // Use this for UI display
      originalName: cat.name, // Keep original name just in case
    });

    // Recursively flatten children
    if (cat.children && cat.children.length > 0) {
      const children = flattenCategories(cat.children, level + 1);
      result = result.concat(children);
    }
  });

  return result;
};

export const useAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      // Call the API that returns the Tree structure
      const res = await adminApi.getAdminCategory();
      const treeData = res.data.data || res.data;

      // 🔥 FLATTEN DATA HERE before setting state
      const flatData = flattenCategories(treeData);

      setCategories(flatData);
    } catch (err) {
      console.error(err);
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
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn chỉ được xóa danh mục con nếu muốn xóa danh mục cha phải xóa hết danh mục con trước",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      background: "#ffffff",
      borderRadius: "25px",
    });

    if (result.isConfirmed) {
      try {
        await adminApi.deleteCategory(id);

        Swal.fire({
          title: "Đã xóa!",
          text: "Danh mục đã được loại bỏ.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchCategories();
      } catch (err) {
        Swal.fire(
          "Lỗi!",
          err.response?.data?.message || "Không thể xóa danh mục",
          "error",
        );
      }
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
