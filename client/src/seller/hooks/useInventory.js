import { useState, useEffect, useCallback } from "react";
import apiClient from "../../services/apiClient";

const inventoryApi = {
  // Lấy danh sách sản phẩm của Seller hiện tại
  getAll: () => apiClient.get("/api/seller/products"),

  // Cập nhật tồn kho
  updateStock: (id, stock) =>
    apiClient.put(`/api/seller/products/${id}`, { stock }),
};

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Helper: Xác định trạng thái tồn kho
  const getStockStatus = (stock) => {
    if (stock === 0) return "out_of_stock";
    if (stock <= 10) return "low_stock";
    return "active";
  };

  // 2. Fetch inventory
  // Sử dụng useCallback để tránh tạo lại hàm này mỗi lần render
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Gọi API qua Service (Token đã được apiClient tự động xử lý)
      const response = await inventoryApi.getAll();
      const data = response.data;

      if (data.success) {
        // Map dữ liệu từ Backend sang format chuẩn của Frontend
        const rawProducts = data.products || data.data || [];

        const inventoryData = rawProducts.map((product) => ({
          id: product._id || product.id,
          sku:
            product.sku ||
            `SP-${(product._id || "").substring(0, 8).toUpperCase()}`,
          name: product.name,
          // Xử lý trường hợp category là object hoặc string
          category:
            product.category?.name || product.category || "Chưa phân loại",
          stock: product.stock || 0,
          price: product.price,
          status: getStockStatus(product.stock),
          images: product.images || [],
          description: product.description,
          sales: product.sales || 0,
        }));

        setInventory(inventoryData);
      } else {
        throw new Error(data.message || "Không thể lấy dữ liệu kho hàng");
      }
    } catch (err) {
      console.error("❌ Error fetching inventory:", err);
      // Lấy message lỗi chuẩn từ Axios response
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi kết nối server";
      setError(errorMessage);
      setInventory([]); // Reset list nếu lỗi
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Cập nhật số lượng tồn kho
  const updateStock = async (productId, newStock) => {
    try {
      const response = await inventoryApi.updateStock(productId, newStock);
      const data = response.data;

      if (data.success) {
        // Cập nhật State nội bộ (Optimistic Update) để giao diện phản hồi ngay lập tức
        setInventory((prev) =>
          prev.map((item) =>
            item.id === productId
              ? { ...item, stock: newStock, status: getStockStatus(newStock) }
              : item
          )
        );
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("❌ Error updating stock:", err);
      const errorMsg = err.response?.data?.message || err.message;
      return { success: false, error: errorMsg };
    }
  };

  // 4. Thống kê tồn kho (Tính toán dựa trên State hiện tại)
  const getInventoryStats = () => {
    const total = inventory.length;
    const active = inventory.filter((item) => item.status === "active").length;
    const lowStock = inventory.filter(
      (item) => item.status === "low_stock"
    ).length;
    const outOfStock = inventory.filter(
      (item) => item.status === "out_of_stock"
    ).length;

    const totalValue = inventory.reduce(
      (sum, item) => sum + item.price * item.stock,
      0
    );

    // Đếm số lượng danh mục duy nhất
    const uniqueCategories = new Set(inventory.map((item) => item.category));

    return {
      total,
      active,
      lowStock,
      outOfStock,
      totalValue,
      categories: uniqueCategories.size,
    };
  };

  // Gọi API khi hook được mount
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    loading,
    error,
    updateStock,
    getInventoryStats,
    refetch: fetchInventory,
  };
};
