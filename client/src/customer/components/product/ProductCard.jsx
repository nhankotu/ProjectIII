import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";

const ProductCard = ({ product, isFlashSale = false }) => {
  const { addToCart, isInCart } = useCart();

  // Lấy ID chuẩn (MongoDB _id hoặc id thường)
  const productId = product._id || product.id;
  const isProductInCart = isInCart(productId);

  // ✅ LOGIC XỬ LÝ ẢNH (QUAN TRỌNG)
  const getDisplayImage = () => {
    // 1. Ưu tiên Thumbnail (Backend FlashSale trả về cái này)
    if (product.thumbnail) {
      return typeof product.thumbnail === "object"
        ? product.thumbnail.url
        : product.thumbnail;
    }
    // 2. Nếu không có, tìm trong mảng images
    if (product.images && product.images.length > 0) {
      const firstImg = product.images[0];
      return typeof firstImg === "object" ? firstImg.url : firstImg;
    }
    // 3. Fallback trường image cũ
    if (product.image) {
      return typeof product.image === "object"
        ? product.image.url
        : product.image;
    }
    // 4. Cuối cùng dùng ảnh giữ chỗ (Dùng placehold.co vì via.placeholder đang lỗi)
    return "https://placehold.co/300x300?text=No+Image";
  };

  const displayImage = getDisplayImage();

  // --- LOGIC GIÁ & KHUYẾN MÃI ---
  // Nếu là Flash Sale -> Dùng salePrice. Nếu thường -> Dùng price
  const displayPrice =
    isFlashSale && product.salePrice ? product.salePrice : product.price;

  // Giá gốc (để gạch ngang)
  const originalPrice =
    product.originalPrice || (isFlashSale ? product.price : null);

  // Tính % giảm
  const discountPercentage =
    originalPrice > displayPrice
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0;

  // Tính % đã bán (Chỉ cho Flash Sale)
  const soldPercent =
    isFlashSale && product.limitQuantity > 0
      ? Math.round((product.soldQuantity / product.limitQuantity) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id: productId, price: displayPrice }, 1);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <Link
      to={`/product/${productId}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full border border-gray-100"
    >
      {/* KHUNG ẢNH */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          // Xử lý khi ảnh bị lỗi (404)
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x300?text=Error";
          }}
        />

        {/* Badge Giảm Giá */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            {isFlashSale && <span>⚡</span>} -{discountPercentage}%
          </div>
        )}

        {/* Nút Giỏ Hàng */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`absolute bottom-2 right-2 p-2 rounded-full shadow-md transition-colors ${
            product.stock <= 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isProductInCart
              ? "bg-green-500 text-white"
              : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white"
          }`}
        >
          {product.stock <= 0 ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : isProductInCart ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* THÔNG TIN SẢN PHẨM */}
      <div className="p-3 flex flex-col flex-grow">
        <h3
          className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[40px]"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="flex flex-col">
            <span className="text-base font-bold text-red-600">
              {formatPrice(displayPrice)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Thanh Tiến Độ (Chỉ hiện khi là Flash Sale) */}
          {isFlashSale && (
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-500"
                style={{ width: `${soldPercent}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white uppercase tracking-wider">
                {product.soldQuantity >= product.limitQuantity
                  ? "CHÁY HÀNG 🔥"
                  : `ĐÃ BÁN ${product.soldQuantity}`}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
