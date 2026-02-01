import { useState, useCallback } from "react";
import { toast } from "sonner";
import adminApi from "../services/adminApi"; // Sử dụng instance đã cấu hình sẵn

export const useAdminFlashSales = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [flashSales, setFlashSales] = useState([]);
  const [sessions, setSessions] = useState([]);

  // 1. Lấy danh sách sản phẩm CHỜ DUYỆT (Flattened Data)
  const fetchPendingFlashSales = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getPendingFlashSales();
      // adminApi sử dụng apiClient nên data nằm trong response.data
      const result = response.data?.data || [];
      setFlashSales(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Fetch Pending Error:", err);
      toast.error("Không thể tải danh sách sản phẩm chờ duyệt");
      setFlashSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Duyệt sản phẩm
  const approveFlashSale = useCallback(async (flashSaleId, requestId) => {
    setSubmitting(true);
    try {
      // Gửi object payload theo đúng logic Backend (flashSaleId, requestId)
      await adminApi.approveFlashSale({ flashSaleId, requestId });

      toast.success("Đã duyệt sản phẩm thành công!");

      // Xóa item khỏi UI
      setFlashSales((prev) =>
        prev.filter((item) => item.requestId !== requestId),
      );
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi duyệt sản phẩm");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  // 3. Từ chối sản phẩm
  const rejectFlashSale = useCallback(async (flashSaleId, requestId) => {
    const reason = window.prompt("Nhập lý do từ chối sản phẩm này:");
    if (reason === null) return false;
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return false;
    }

    setSubmitting(true);
    try {
      await adminApi.rejectFlashSale({ flashSaleId, requestId, reason });

      toast.success("Đã từ chối yêu cầu");

      setFlashSales((prev) =>
        prev.filter((item) => item.requestId !== requestId),
      );
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi từ chối sản phẩm");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  // 4. Lấy tất cả KHUNG GIỜ (Sessions)
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllSessions(); // Đảm bảo adminApi có hàm này
      setSessions(response.data?.data || []);
    } catch (err) {
      console.error("Fetch Sessions Error:", err);
      toast.error("Không thể tải danh sách khung giờ");
    } finally {
      setLoading(false);
    }
  }, []);

  // 5. Tạo KHUNG GIỜ mới (Session)
  const createSession = useCallback(
    async (sessionData) => {
      setSubmitting(true);
      try {
        const data = new FormData();
        data.append("title", sessionData.title);
        data.append("startTime", sessionData.startTime);
        data.append("endTime", sessionData.endTime);

        if (sessionData.image instanceof File) {
          data.append("images", sessionData.image);
        }

        const response = await adminApi.createFlashSaleSession(data);

        if (response.data.success) {
          toast.success("Tạo khung giờ Flash Sale thành công!");
          await fetchSessions();
          return true;
        }
      } catch (err) {
        console.error("Create Session Error:", err.response?.data);
        const msg = err.response?.data?.message || "Lỗi khi tạo khung giờ";
        toast.error(msg);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchSessions],
  );

  return {
    loading,
    submitting,
    flashSales,
    sessions,
    fetchPendingFlashSales,
    approveFlashSale,
    rejectFlashSale,
    fetchSessions,
    createSession,
  };
};
