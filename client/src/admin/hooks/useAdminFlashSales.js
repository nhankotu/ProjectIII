import { useState, useCallback } from "react";
import { toast } from "sonner";
import adminApi from "../services/adminApi";

export const useAdminFlashSales = () => {
  const [loading, setLoading] = useState(false);
  const [flashSales, setFlashSales] = useState([]);

  // 1. Lấy danh sách chờ duyệt
  const fetchPendingFlashSales = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi hàm từ service adminApi (đã định nghĩa ở bước trước)
      const response = await adminApi.getPendingFlashSales();

      // Axios trả về object response, dữ liệu thường nằm trong response.data.data
      const data = response.data.data || response.data || [];
      setFlashSales(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách Flash Sale");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Duyệt Flash Sale
  const approveFlashSale = useCallback(async (id) => {
    setLoading(true);
    try {
      await adminApi.approveFlashSale(id);

      toast.success("Đã duyệt chương trình Flash Sale!");

      // Cập nhật state cục bộ (xóa item đã duyệt khỏi danh sách chờ)
      // Giúp giao diện phản hồi nhanh mà không cần gọi lại API fetch
      setFlashSales((prev) => prev.filter((item) => item._id !== id));

      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi khi duyệt";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Từ chối Flash Sale
  const rejectFlashSale = useCallback(async (id) => {
    // Hỏi xác nhận trước khi gọi API (An toàn)
    if (!window.confirm("Bạn chắc chắn muốn từ chối yêu cầu này?")) return;

    setLoading(true);
    try {
      await adminApi.rejectFlashSale(id);

      toast.success("Đã từ chối chương trình Flash Sale");

      // Cập nhật state cục bộ
      setFlashSales((prev) => prev.filter((item) => item._id !== id));

      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi khi từ chối";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    flashSales, // Đổi tên pendingFlashSales -> flashSales cho gọn
    fetchPendingFlashSales,
    approveFlashSale,
    rejectFlashSale,
  };
};
