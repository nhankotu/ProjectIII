import { useState, useEffect } from "react";
import adminApi from "../services/adminApi";

export const usePlatformRevenue = (range = "month") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPlatformRevenue({ range });

      console.log("--- DEBUG LOG ---");
      // Kiểm tra xem res là data đã bóc hay là nguyên cục Axios
      const responseData = res.data ? res.data : res;
      console.log("Payload thực tế:", responseData);

      if (responseData && responseData.success) {
        // Lưu thẳng cái object chứa { stats, revenueReport, payments }
        setData(responseData.data);
      } else {
        console.error("❌ Backend báo lỗi hoặc success = false");
      }
    } catch (err) {
      console.error("❌ Lỗi gọi API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [range]);

  return { data, loading, refresh: fetchRevenue };
};

export const useShopsRevenue = (range = "month") => {
  const [shops, setShops] = useState([]); // Khởi tạo mảng rỗng
  const [loading, setLoading] = useState(true);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getShopsRevenue({ range });

      // Kiểm tra cấu trúc Axios
      const responseData = res.data ? res.data : res;

      if (responseData && responseData.success) {
        // 🔥 QUAN TRỌNG: Backend trả về { data: [...] } thì phải lấy đúng mảng đó
        setShops(responseData.data || []);
      }
    } catch (err) {
      console.error("❌ Lỗi lấy doanh thu shop:", err);
      setShops([]); // Nếu lỗi thì trả về mảng rỗng để không crash trang
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [range]);

  return { shops, loading, refresh: fetchShops };
};
