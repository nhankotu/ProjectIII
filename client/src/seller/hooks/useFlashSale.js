import { useState, useEffect, useCallback } from "react";
// Import các hàm API từ service
import { flashSaleApi, productApi } from "../services/api";

const useFlashSale = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================
  // 1. FETCH DATA (Gọi song song 3 API)
  // ============================================================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Promise.all giúp gọi song song, tiết kiệm thời gian chờ
      const [myRegsRes, eventsRes, productRes] = await Promise.all([
        flashSaleApi.getSellerFlashSales(),
        flashSaleApi.getAvailable(),
        productApi.getAll({ limit: 100 }), // Lấy 100 sp để chọn cho dễ
      ]);

      // 1. Set danh sách đăng ký
      if (myRegsRes.success) {
        setFlashSales(myRegsRes.data || []);
      }

      // 2. Set sự kiện đang mở
      if (eventsRes.success) {
        setAvailableEvents(eventsRes.data || []);
      }

      const prodList = productRes.data || productRes.products || [];
      setProducts(Array.isArray(prodList) ? prodList : []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu FlashSale:", err);
      // Lấy message lỗi chuẩn từ Axios
      setError(err.response?.data?.message || err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================================
  // 2. REGISTER FUNCTION
  // ============================================================
  const registerProduct = async (payload) => {
    try {
      const res = await flashSaleApi.register(payload);

      if (res.success) {
        await fetchData();
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Lỗi đăng ký";
      return { success: false, message: msg };
    }
  };

  return {
    flashSales,
    availableEvents,
    products,
    loading,
    error,
    registerProduct,
    refresh: fetchData,
  };
};

export default useFlashSale;
