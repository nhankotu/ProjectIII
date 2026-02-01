import { useState, useEffect, useCallback, useMemo } from "react";
import { inventoryApi } from "../services/api"; // Import từ file service

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Helper: Xác định trạng thái tồn kho (Logic nghiệp vụ)
  const getStockStatus = (stock) => {
    if (stock === 0) return "out_of_stock";
    if (stock <= 10) return "low_stock";
    return "active";
  };

  // 2. Fetch inventory
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Gọi API tách biệt
      const data = await inventoryApi.getProducts();

      if (data.success) {
        const rawProducts = data.products || data.data || [];

        // Data Mapping: Chuẩn hóa dữ liệu ngay đầu vào
        const inventoryData = rawProducts.map((product) => ({
          id: product._id || product.id,
          sku:
            product.sku ||
            `SP-${(product._id || "").substring(0, 8).toUpperCase()}`,
          name: product.name,
          category:
            product.category?.name || product.category || "Chưa phân loại",
          stock: product.stock || 0,
          price: product.price || 0,
          status: getStockStatus(product.stock || 0), // Tính trạng thái ngay lúc map
          images: product.images || [],
          description: product.description || "",
          sales: product.sales || 0,
        }));

        setInventory(inventoryData);
      } else {
        throw new Error(data.message || "Không thể lấy dữ liệu kho hàng");
      }
    } catch (err) {
      console.error("❌ Error fetching inventory:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi kết nối server";
      setError(errorMessage);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Cập nhật số lượng tồn kho
  const updateStock = async (productId, newStock) => {
    try {
      // A. Optimistic Update: Cập nhật giao diện ngay lập tức
      setInventory((prev) =>
        prev.map((item) =>
          item.id === productId
            ? { ...item, stock: newStock, status: getStockStatus(newStock) }
            : item,
        ),
      );

      // B. Gọi API ngầm bên dưới
      const data = await inventoryApi.updateStock(productId, newStock);

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        // Nếu API báo lỗi logic (ví dụ: kho bị khóa), throw error để catch bên dưới
        throw new Error(data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("❌ Error updating stock:", err);
      // C. Rollback: Nếu lỗi, load lại dữ liệu cũ từ server để đồng bộ
      fetchInventory();

      const errorMsg = err.response?.data?.message || err.message;
      return { success: false, error: errorMsg };
    }
  };

  // 4. Thống kê (Dùng useMemo để tối ưu hiệu năng, chỉ tính lại khi inventory đổi)
  const stats = useMemo(() => {
    const total = inventory.length;
    const active = inventory.filter((item) => item.status === "active").length;
    const lowStock = inventory.filter(
      (item) => item.status === "low_stock",
    ).length;
    const outOfStock = inventory.filter(
      (item) => item.status === "out_of_stock",
    ).length;

    const totalValue = inventory.reduce(
      (sum, item) => sum + item.price * item.stock,
      0,
    );

    // Đếm số lượng danh mục duy nhất
    const uniqueCategories = new Set(inventory.map((item) => item.category))
      .size;

    return {
      total,
      active,
      lowStock,
      outOfStock,
      totalValue,
      categories: uniqueCategories,
    };
  }, [inventory]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    loading,
    error,
    updateStock,
    stats,
    refetch: fetchInventory,
  };
};
