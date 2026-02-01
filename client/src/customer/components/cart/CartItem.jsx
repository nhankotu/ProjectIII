import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";

const CartItem = ({ item, isSelected, onSelect, isDisabled }) => {
  const { removeFromCart, updateQuantity } = useCart();

  // 🔥 IDs
  const cartItemId = item._id;
  const productPageId = item.productId || item.id;

  // 🖼️ Xử lý ảnh
  const getImageUrl = () => {
    if (typeof item.thumbnail === "string") return item.thumbnail;
    if (item.thumbnail?.url) return item.thumbnail.url;
    return "https://via.placeholder.com/100?text=NoImg";
  };

  const displayImage = getImageUrl();
  const itemTotal = (item.price || 0) * item.quantity;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  return (
    <div
      className={`p-4 transition-colors border-b last:border-b-0 ${
        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
      } ${isDisabled ? "opacity-60 grayscale bg-gray-50" : ""}`}
    >
      <div className="flex items-center">
        {/* 1. CHECKBOX */}
        <div className="mr-4 flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={onSelect}
            disabled={isDisabled}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        {/* 2. ẢNH */}
        <Link to={`/product/${productPageId}`} className="flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
            <img
              src={displayImage}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/100?text=Error";
              }}
            />
            {isDisabled && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
                  Hết hàng
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* 3. INFO */}
        <div className="ml-4 flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Tên & Variant */}
          <div className="md:col-span-5">
            <Link
              to={`/product/${productPageId}`}
              className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
            >
              {item.name}
            </Link>

            {/* 👇 ĐOẠN LOGIC ĐÃ SỬA: HIỂN THỊ SKU NẾU KHÔNG CÓ OPTIONS */}
            {item.variant && (
              <div className="mt-1">
                {item.variant.options &&
                Object.keys(item.variant.options).length > 0 ? (
                  // Case 1: Có Option (Màu, Size...) -> Hiển thị đẹp
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    {Object.entries(item.variant.options).map(
                      ([key, value]) => (
                        <span
                          key={key}
                          className="bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200"
                        >
                          {key}:{" "}
                          <span className="font-medium text-gray-700">
                            {value}
                          </span>
                        </span>
                      ),
                    )}
                  </div>
                ) : (
                  // Case 2: Không có Option -> Hiển thị SKU
                  <div className="text-xs text-gray-500 bg-gray-50 inline-block px-2 py-1 rounded border">
                    Phân loại:{" "}
                    <span className="font-medium font-mono">
                      {item.variant.sku}
                    </span>
                  </div>
                )}
              </div>
            )}
            {/* 👆 KẾT THÚC ĐOẠN SỬA */}

            {/* Báo lỗi nếu có */}
            {isDisabled && (
              <p className="text-red-500 text-xs mt-1">
                Sản phẩm này hiện không khả dụng.
              </p>
            )}
          </div>

          {/* Giá */}
          <div className="hidden md:block md:col-span-2 text-center font-medium text-gray-900">
            {formatPrice(item.price)}
          </div>

          {/* Số lượng */}
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="flex items-center border border-gray-300 rounded-lg bg-white h-9">
              <button
                onClick={() => updateQuantity(cartItemId, item.quantity - 1)}
                disabled={item.quantity <= 1 || isDisabled}
                className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-lg"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(cartItemId, item.quantity + 1)}
                disabled={item.quantity >= item.stock || isDisabled}
                className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-lg"
              >
                <Plus size={14} />
              </button>
            </div>
            {/* Mobile Total Price */}
            <div className="md:hidden ml-auto font-bold text-blue-600">
              {formatPrice(itemTotal)}
            </div>
          </div>

          {/* Thành tiền (Desktop) */}
          <div className="hidden md:block md:col-span-2 text-center font-bold text-blue-600">
            {formatPrice(itemTotal)}
          </div>

          {/* Nút xóa */}
          <div className="md:col-span-1 text-right md:text-center">
            <button
              onClick={() => removeFromCart(cartItemId)}
              className="text-gray-400 hover:text-red-600 p-2 transition-colors hover:bg-red-50 rounded-full"
              title="Xóa sản phẩm"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
