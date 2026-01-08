import { useState, useEffect } from "react";
import { productAPI } from "../services/api"; // Import bộ API đã chuẩn hóa

export const useHomeData = () => {
  const [data, setData] = useState({
    categories: [],
    featuredProducts: [],
    flashSales: [],
    hotProducts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true }));

        // Gọi song song các API để tiết kiệm thời gian
        const [categoriesRes, featuredRes, flashSaleRes, hotRes] =
          await Promise.all([
            productAPI.getCategories().catch((err) => {
              console.error("Lỗi categories:", err);
              return []; // Trả về mảng rỗng để không sập app
            }),
            productAPI.getFeatured().catch((err) => []),
            productAPI.getFlashSale().catch((err) => []),
            productAPI.getHot().catch((err) => []),
          ]);

        setData({
          categories: categoriesRes || [],
          featuredProducts: featuredRes || [],
          flashSales: flashSaleRes || [],
          hotProducts: hotRes || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching home data:", error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Không thể tải dữ liệu trang chủ",
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};
