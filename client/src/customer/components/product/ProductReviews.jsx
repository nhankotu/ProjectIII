import React, { useState, useEffect } from "react";
import { productAPI } from "../../services/api";
import { Star, User, CheckCircle, AlertCircle } from "lucide-react";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CHỈ LẤY DỮ LIỆU ĐÁNH GIÁ
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const res = await productAPI.getReviews(productId);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy đánh giá:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  // 2. LOGIC TÍNH TOÁN SAO TRUNG BÌNH
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // 3. LOGIC TÍNH PHẦN TRĂM THANH TIẾN ĐỘ
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
    };
  });

  if (loading)
    return (
      <div className="py-10 text-center animate-pulse text-gray-400 font-medium">
        Đang tải đánh giá...
      </div>
    );

  return (
    <div className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      {/* Header: Chỉ hiển thị Thống kê sao */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-8 border-gray-50">
        <div className="flex flex-wrap items-center gap-8">
          {/* Điểm số trung bình */}
          <div className="text-center">
            <div className="text-5xl font-black text-gray-900">
              {calculateAverageRating()}
            </div>
            <div className="flex text-yellow-400 mt-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={
                    i < Math.floor(calculateAverageRating())
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    i < Math.floor(calculateAverageRating())
                      ? ""
                      : "text-gray-200"
                  }
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">
              {reviews.length} Đánh giá
            </p>
          </div>

          {/* Thanh thống kê chi tiết các mức sao */}
          <div className="hidden sm:block space-y-1.5 min-w-[240px]">
            {ratingDistribution.map((item) => (
              <div key={item.star} className="flex items-center gap-3 text-xs">
                <span className="w-4 font-bold text-gray-600">
                  {item.star}★
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-gray-400 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nơi này trước đây có nút Viết đánh giá - Đã loại bỏ hoàn toàn */}
      </div>

      {/* Danh sách các bài nhận xét */}
      <div className="divide-y divide-gray-100">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="py-10 first:pt-0 border-b last:border-0 border-gray-50"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  {/* Avatar Người dùng - Lấy từ review.userId */}
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 overflow-hidden shadow-inner">
                    {review.userId?.avatar ? (
                      <img
                        src={review.userId.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {/* Tên người dùng - Ưu tiên name sau đó tới username */}
                      {review.userId?.name ||
                        review.userId?.username ||
                        "Khách hàng"}
                      {review.isVerified && (
                        <CheckCircle
                          size={14}
                          className="text-green-500"
                          title="Đã mua hàng"
                        />
                      )}
                    </div>
                    {/* Số sao đánh giá */}
                    <div className="flex text-yellow-400 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < review.rating ? "currentColor" : "none"}
                          className={i < review.rating ? "" : "text-gray-200"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Ngày đánh giá */}
                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              {/* Nội dung đánh giá của khách */}
              <div className="md:pl-16">
                {review.title && (
                  <h4 className="font-bold text-gray-900 mb-2">
                    {review.title}
                  </h4>
                )}
                <p className="text-gray-700 leading-relaxed italic text-sm md:text-base">
                  "{review.comment}"
                </p>

                {/* Hiển thị hình ảnh khách gửi (nếu có) */}
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="đánh giá thực tế"
                        className="w-20 h-20 object-cover rounded-xl border border-gray-100 hover:scale-105 transition-transform cursor-zoom-in"
                      />
                    ))}
                  </div>
                )}

                {/* PHẦN MỚI: Phản hồi của Seller (Shop) */}
                {review.sellerReply?.comment && (
                  <div className="mt-6 p-5 bg-blue-50/50 rounded-2xl border-l-4 border-blue-400 relative">
                    <div className="absolute -top-3 left-4 bg-blue-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
                      Shop phản hồi
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      {review.sellerReply.comment}
                    </p>
                    <div className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
                      <span>Cập nhật:</span>
                      {new Date(
                        review.sellerReply.createdAt,
                      ).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-300">
            <AlertCircle className="mx-auto mb-3 opacity-20" size={64} />
            <p className="text-lg font-medium">
              Chưa có đánh giá nào cho sản phẩm này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
