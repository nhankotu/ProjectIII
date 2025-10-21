import { useState, useEffect } from "react";

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      // Mock data - sản phẩm thời trang/tiêu dùng
      const mockInventory = [
        {
          id: 1,
          sku: "ATNAM-XL-DEN-001",
          name: "Áo thun nam XL màu đen",
          category: "Thời trang",
          currentStock: 45,
          safetyStock: 10,
          costPrice: 80000,
          salePrice: 150000,
          status: "in_stock",
          supplier: "Công ty Dệt may ABC",
          lastRestocked: "2024-10-01",
          daysInStock: 15,
          totalValue: 3600000,
        },
        {
          id: 2,
          sku: "QJNUS-M-001",
          name: "Quần jeans nữ size M",
          category: "Thời trang",
          currentStock: 8,
          safetyStock: 15,
          costPrice: 180000,
          salePrice: 350000,
          status: "low_stock",
          supplier: "Xưởng may XYZ",
          lastRestocked: "2024-09-28",
          daysInStock: 18,
          totalValue: 1440000,
        },
        {
          id: 3,
          sku: "GTSNK-38-001",
          name: "Giày thể thao nữ size 38",
          category: "Giày dép",
          currentStock: 0,
          safetyStock: 5,
          costPrice: 150000,
          salePrice: 280000,
          status: "out_of_stock",
          supplier: "Công ty Giày da DEF",
          lastRestocked: "2024-09-20",
          daysInStock: 25,
          totalValue: 0,
        },
        {
          id: 4,
          sku: "TUXDA-001",
          name: "Túi xách da bò",
          category: "Phụ kiện",
          currentStock: 25,
          safetyStock: 8,
          costPrice: 120000,
          salePrice: 250000,
          status: "in_stock",
          supplier: "Xưởng da GHI",
          lastRestocked: "2024-10-05",
          daysInStock: 5,
          totalValue: 3000000,
        },
        {
          id: 5,
          sku: "VINAM-001",
          name: "Ví nam da thật",
          category: "Phụ kiện",
          currentStock: 3,
          safetyStock: 10,
          costPrice: 90000,
          salePrice: 180000,
          status: "low_stock",
          supplier: "Xưởng da GHI",
          lastRestocked: "2024-09-25",
          daysInStock: 20,
          totalValue: 270000,
        },
      ];

      const mockSuppliers = [
        {
          id: 1,
          name: "Công ty Dệt may ABC",
          contact: "0123456789",
          rating: 4.5,
        },
        { id: 2, name: "Xưởng may XYZ", contact: "0987654321", rating: 4.2 },
        {
          id: 3,
          name: "Công ty Giày da DEF",
          contact: "0369852147",
          rating: 4.7,
        },
        { id: 4, name: "Xưởng da GHI", contact: "0912345678", rating: 4.3 },
      ];

      setInventory(mockInventory);
      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = (productId, newStock) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              currentStock: newStock,
              status: getStockStatus(newStock, item.safetyStock),
              totalValue: newStock * item.costPrice,
            }
          : item
      )
    );
  };

  const getStockStatus = (currentStock, safetyStock) => {
    if (currentStock === 0) return "out_of_stock";
    if (currentStock <= safetyStock) return "low_stock";
    return "in_stock";
  };

  const getInventoryStats = () => {
    const totalProducts = inventory.length;
    const lowStockProducts = inventory.filter(
      (item) => item.status === "low_stock"
    ).length;
    const outOfStockProducts = inventory.filter(
      (item) => item.status === "out_of_stock"
    ).length;
    const totalValue = inventory.reduce(
      (sum, item) => sum + item.totalValue,
      0
    );

    const turnoverRate = calculateTurnoverRate();

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      turnoverRate,
    };
  };

  const calculateTurnoverRate = () => {
    // Mock calculation - trong thực tế dựa trên sales data
    return 2.8;
  };

  return {
    inventory,
    suppliers,
    loading,
    updateStock,
    getInventoryStats,
    refetch: fetchInventoryData,
  };
};
