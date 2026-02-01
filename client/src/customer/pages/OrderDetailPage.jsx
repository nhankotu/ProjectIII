import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { orderAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Star,
  MessageSquare,
  Trash2,
  Edit3,
} from "lucide-react";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho Đánh giá
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getOrderById(id);
      const orderData = res.data || res;
      setOrder(orderData);

      // --- LOGIC TỰ ĐỘNG MỞ MODAL ---

      if (location.state?.autoOpenReview && orderData.items) {
        const targetId = location.state.targetProductId;
        const itemToReview = orderData.items.find(
          (item) => (item.product?._id || item.product) === targetId,
        );

        if (itemToReview) {
          handleOpenReview(itemToReview);

          window.history.replaceState({}, document.title);
        }
      }
    } catch (error) {
      console.error("Lỗi tải chi tiết đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  // Mở modal: Nếu có review cũ thì đổ dữ liệu vào để Sửa
  const handleOpenReview = (item) => {
    setSelectedProduct(item);
    if (item.isReviewed && item.reviewData) {
      setRating(item.reviewData.rating);
      setComment(item.reviewData.comment);
      setIsEditing(true);
    } else {
      setRating(5);
      setComment("");
      setIsEditing(false);
    }
    setShowReviewModal(true);
  };
  // Gửi Đánh giá (Upsert: Thêm hoặc Sửa)
  const handleSubmitReview = async () => {
    if (!comment.trim()) return alert("Vui lòng nhập nội dung đánh giá");
    setSubmitting(true);
    try {
      // Dùng hàm upsertReview (PUT/PATCH) đã viết ở Backend
      await orderAPI.upsertReview({
        orderId: order._id,
        productId: selectedProduct.product._id || selectedProduct.product,
        rating,
        comment,
      });
      alert(
        isEditing ? "Cập nhật đánh giá thành công!" : "Đánh giá thành công!",
      );
      setShowReviewModal(false);
      fetchOrderDetail(); // Tải lại dữ liệu để cập nhật trạng thái nút
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi xử lý đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa đánh giá
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await orderAPI.deleteReview(reviewId);
      alert("Đã xóa đánh giá!");
      fetchOrderDetail();
    } catch (error) {
      alert("Không thể xóa đánh giá");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order)
    return <div className="p-10 text-center">Đơn hàng không tồn tại.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-6 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={20} /> Quay lại
      </button>

      {/* Thông tin đơn hàng (Address & Payment) - Giữ nguyên logic cũ của bạn */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h1 className="text-xl font-bold">
            Mã đơn: #{order.orderCode || order._id.slice(-8).toUpperCase()}
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === "delivered"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {order.status === "delivered" ? "Đã giao hàng" : order.status}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <MapPin size={18} /> Địa chỉ nhận hàng
            </h3>
            <p className="text-sm font-medium">
              {order.shippingAddress?.fullName}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.phone}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.address}
            </p>
          </div>
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <CreditCard size={18} /> Thanh toán
            </h3>
            <p className="text-sm text-gray-600">
              {order.paymentMethod?.toUpperCase()}
            </p>
            <p className="text-sm font-bold text-red-600 mt-2">
              Tổng cộng: {order.totalAmount?.toLocaleString()}đ
            </p>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm kèm trạng thái Đánh giá */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50 font-bold flex items-center gap-2">
          <Package size={18} /> Sản phẩm đã đặt
        </div>
        <div className="divide-y">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 flex flex-col gap-3 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.thumbnail || "https://via.placeholder.com/80"}
                  className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                  alt={item.name}
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Số lượng: {item.quantity}
                  </p>
                  <p className="font-bold text-blue-600 mt-1">
                    {item.price?.toLocaleString()}đ
                  </p>
                </div>

                {order.status === "delivered" && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleOpenReview(item)}
                      className={`flex items-center justify-center gap-1 px-4 py-2 border rounded-lg text-sm font-bold transition-all ${
                        item.isReviewed
                          ? "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                      }`}
                    >
                      {item.isReviewed ? (
                        <>
                          <Edit3 size={14} /> Sửa đánh giá
                        </>
                      ) : (
                        <>
                          <Star size={14} /> Đánh giá
                        </>
                      )}
                    </button>

                    {item.isReviewed && (
                      <button
                        onClick={() => handleDeleteReview(item.reviewData?._id)}
                        className="flex items-center justify-center gap-1 text-xs text-red-500 hover:underline"
                      >
                        <Trash2 size={12} /> Xóa đánh giá
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* HIỂN THỊ NỘI DUNG ĐÁNH GIÁ CŨ (Nếu có) */}
              {item.isReviewed && item.reviewData && (
                <div className="ml-24 p-3 bg-blue-50/50 rounded-lg border border-blue-100 relative">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < item.reviewData.rating ? "#EAB308" : "none"}
                        className={
                          i < item.reviewData.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 italic">
                    "{item.reviewData.comment}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Đánh giá (Tự động thích ứng Thêm/Sửa) */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <MessageSquare className="text-blue-600" />{" "}
              {isEditing ? "Cập nhật đánh giá" : "Viết đánh giá mới"}
            </h2>

            <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-xl border border-dashed">
              <img
                src={selectedProduct?.thumbnail}
                className="w-14 h-14 object-cover rounded-md"
                alt=""
              />
              <p className="text-sm font-medium text-gray-700 line-clamp-2">
                {selectedProduct?.name}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold text-gray-700 mb-3 text-center">
                Bạn thấy sản phẩm này thế nào?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={40}
                    className={`cursor-pointer transition-transform active:scale-90 ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <textarea
              className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-0 outline-none mb-6 transition-all"
              rows="4"
              placeholder="Sản phẩm dùng rất tốt, đóng gói kỹ..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 shadow-lg shadow-blue-200 transition-all"
              >
                {submitting
                  ? "Đang xử lý..."
                  : isEditing
                    ? "Cập nhật"
                    : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
