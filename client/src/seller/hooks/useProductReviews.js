import { useState, useEffect, useCallback } from "react";
import { reviewApi } from "../services/api"; // Đảm bảo bạn đã thêm reviewApi vào file api.js

export const useProductReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dùng useCallback để hàm fetch không bị tạo lại mỗi lần component render
  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await reviewApi.getProductReviews(productId);

      // Axios trả về dữ liệu trong response.data
      // Cấu trúc Backend của bạn: { success: true, data: [...] }
      if (response.data && response.data.success) {
        setReviews(response.data.data);
      } else {
        setReviews(response.data || []);
      }
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
      setError(
        err.response?.data?.message || "Không thể tải danh sách đánh giá.",
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Tự động gọi khi vào trang hoặc chuyển tab
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
  };
};
