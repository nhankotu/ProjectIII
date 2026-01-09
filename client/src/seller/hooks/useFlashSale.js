import { useState, useEffect, useCallback } from "react";

// Nếu chưa có .env thì dùng localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const useFlashSale = () => {
  const [flashSales, setFlashSales] = useState([]); // Danh sách các chiến dịch
  const [products, setProducts] = useState([]); // Danh sách sản phẩm của Shop để chọn
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();

      const [flashSaleRes, productRes] = await Promise.all([
        fetch(`${API_BASE}/api/seller/flash-sales`, { headers }),
        fetch(`${API_BASE}/api/seller/products?limit=100`, { headers }),
      ]);

      const checkResponse = async (res, name) => {
        if (res.status === 500)
          throw new Error(`Lỗi Server (500) khi gọi ${name}`);
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") === -1) {
          throw new Error(`API ${name} trả về HTML.`);
        }
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Lỗi tải dữ liệu");
        }
        return res.json();
      };

      const flashSaleData = await checkResponse(flashSaleRes, "Flash Sale");
      const productData = await checkResponse(productRes, "Sản phẩm");

      // BE trả về { success: true, data: [...] }
      setFlashSales(flashSaleData.data || []);

      const prodList = productData.products || productData.data || [];
      setProducts(Array.isArray(prodList) ? prodList : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Hàm tạo chiến dịch (Campaign)
  const createFlashSale = async (payload) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE}/api/seller/flash-sales`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Lỗi khi tạo Flash Sale");
      }

      await fetchData();
      return { success: true, data: resData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    flashSales,
    products,
    loading,
    error,
    createFlashSale,
    refresh: fetchData,
  };
};

export default useFlashSale;
