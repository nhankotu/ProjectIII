import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { ShoppingCart, Eye, Zap, Flame } from "lucide-react";

const ProductCard = ({ product, isFlashSale = false }) => {
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  // 1. Sửa lỗi ID: Hỗ trợ mọi loại tên trường ID từ API
  const productId = product._id || product.id || product.productId;
  const isProductInCart = isInCart(productId);

  // 2. Helper lấy ảnh chuẩn (Xử lý cả Object Cloudinary và String)
  const getDisplayImage = () => {
    const thumb = product.thumbnail?.url || product.thumbnail;
    if (thumb && typeof thumb === "string") return thumb;

    const firstImg = product.images?.[0]?.url || product.images?.[0];
    if (firstImg && typeof firstImg === "string") return firstImg;

    return "https://placehold.co/300x300?text=No+Image";
  };

  const displayImage = getDisplayImage();

  // 3. Logic Giá & Giảm giá
  // Giá bán thực tế
  const currentPrice =
    isFlashSale && product.salePrice ? product.salePrice : product.price;

  // Giá gốc để so sánh (Gạch ngang)
  const basePrice =
    product.originalPrice || (isFlashSale ? product.price : null);

  const discountPercentage =
    basePrice > currentPrice
      ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
      : 0;

  // Thanh tiến độ Flash Sale
  const soldPercent =
    isFlashSale && product.limitQuantity > 0
      ? Math.min(
          Math.round((product.soldQuantity / product.limitQuantity) * 100),
          100,
        )
      : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.type === "variable") {
      navigate(`/product/${productId}`);
    } else {
      addToCart({
        product: product,
        quantity: 1,
      });
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <Link
      to={`/product/${productId}`}
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border-2 
        ${isFlashSale ? "border-red-100 hover:border-red-500" : "border-transparent hover:border-blue-500"}`}
    >
      {/* ⚡ BADGE GIẢM SỐC (Chỉ hiện khi giảm > 30%) */}
      {discountPercentage >= 30 && (
        <div className="absolute top-0 right-0 z-10 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-bl-xl shadow-md animate-pulse">
          GIẢM SỐC
        </div>
      )}

      {/* KHUNG ẢNH */}
      <div className="relative h-52 overflow-hidden bg-gray-50">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge % Giảm giá */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
            {isFlashSale && <Zap size={12} fill="currentColor" />}-
            {discountPercentage}%
          </div>
        )}

        {/* Nút Action nhanh */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`absolute bottom-3 right-3 p-3 rounded-xl shadow-2xl transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
            ${product.stock <= 0 ? "bg-gray-300 text-white" : isProductInCart ? "bg-green-500 text-white" : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white"}`}
        >
          {product.type === "variable" ? (
            <Eye size={18} />
          ) : (
            <ShoppingCart size={18} />
          )}
        </button>
      </div>

      {/* NỘI DUNG */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 min-h-[40px] group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto">
          {/* Khu vực Giá */}
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="text-lg font-black text-red-600">
              {formatPrice(currentPrice)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {formatPrice(basePrice)}
              </span>
            )}
          </div>

          {/* HIỂN THỊ RIÊNG CHO FLASH SALE */}
          {isFlashSale ? (
            <div className="space-y-2">
              <div className="relative w-full h-4 bg-red-100 rounded-full overflow-hidden border border-red-200">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-orange-400 transition-all duration-1000"
                  style={{ width: `${soldPercent}%` }}
                >
                  {/* Hiệu ứng bóng đổ chạy dọc thanh tiến độ */}
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white uppercase drop-shadow-md">
                  {soldPercent >= 90
                    ? "Sắp cháy hàng 🔥"
                    : `Đã bán ${product.soldQuantity}`}
                </div>
              </div>
              {/* Nhãn giới hạn thời gian */}
              <div className="flex items-center gap-1 text-[10px] text-orange-600 font-bold uppercase tracking-tighter">
                <Flame size={12} fill="currentColor" /> Kết thúc sớm
              </div>
            </div>
          ) : (
            /* Hiển thị cho hàng thường */
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span>Đã bán {product.sold || 0}</span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-orange-500">Chỉ còn {product.stock}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
