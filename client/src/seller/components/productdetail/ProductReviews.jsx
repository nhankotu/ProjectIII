import React, { useState } from "react";
import { useProductReviews } from "../../hooks/useProductReviews";
import { apiClient } from "../../services/api";
import { Star, Send, User, MessageCircle } from "lucide-react";

const ProductReviews = ({ productId }) => {
  const { reviews, loading, refetch } = useProductReviews(productId);
  const [replyText, setReplyText] = useState({});
  const [submittingId, setSubmittingId] = useState(null); // Theo dõi ID đang gửi

  const handleReplySubmit = async (reviewId) => {
    if (!replyText[reviewId]?.trim()) return;

    try {
      setSubmittingId(reviewId);
      await apiClient.put(`/api/seller/reviews/${reviewId}/reply`, {
        comment: replyText[reviewId],
      });

      // Xóa nội dung input sau khi gửi
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
      refetch(); // Tải lại danh sách để hiện phản hồi mới
    } catch (err) {
      alert(
        "Lỗi khi gửi phản hồi: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Đang tải đánh giá...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle size={20} className="text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Phản hồi khách hàng</h3>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300 text-gray-400">
          Sản phẩm này chưa có đánh giá nào.
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md"
          >
            {/* Header: User & Rating */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                  {review.userId?.avatar ? (
                    <img
                      src={review.userId.avatar}
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-blue-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">
                    {review.userId?.username || "Khách ẩn danh"}
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < review.rating ? "currentColor" : "none"}
                        className="mr-0.5"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>

            {/* Nội dung đánh giá */}
            <div className="md:ml-13">
              <p className="text-[11px] inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md mb-2">
                Phân loại: {review.variantName || "Mặc định"}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Hiển thị ảnh đánh giá nếu có */}
              {review.images?.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      alt="review"
                    />
                  ))}
                </div>
              )}

              {/* Khối phản hồi */}
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                {review.sellerReply?.comment ? (
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1">
                      Bạn đã phản hồi:
                    </p>
                    <p className="text-sm text-gray-600 italic leading-snug">
                      "{review.sellerReply.comment}"
                    </p>
                    <p className="text-[9px] text-gray-400 mt-2">
                      Ngày phản hồi:{" "}
                      {new Date(
                        review.sellerReply.createdAt,
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Viết phản hồi:
                    </p>
                    <div className="relative">
                      <textarea
                        className="w-full p-3 pr-12 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all resize-none"
                        placeholder="Gửi lời cảm ơn hoặc giải đáp thắc mắc của khách..."
                        rows="2"
                        value={replyText[review._id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [review._id]: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => handleReplySubmit(review._id)}
                        disabled={
                          submittingId === review._id ||
                          !replyText[review._id]?.trim()
                        }
                        className="absolute right-2 bottom-2 p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-30 transition-colors"
                      >
                        {submittingId === review._id ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductReviews;
