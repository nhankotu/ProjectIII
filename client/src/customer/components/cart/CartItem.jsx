import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";

// Nhận thêm props: isSelected và onSelect
const CartItem = ({ item, isSelected, onSelect }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const productId = item.productId || item._id || item.id;

  const getImageUrl = (imageData) => {
    if (!imageData) return "";
    if (typeof imageData === "object" && imageData.url) return imageData.url;
    return imageData;
  };

  const displayImage =
    getImageUrl(
      item.thumbnail || (item.images && item.images[0]) || item.image
    ) || "https://via.placeholder.com/100";
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
      }`}
    >
      <div className="flex items-center">
        {/* ✅ 1. CHECKBOX CHỌN SẢN PHẨM */}
        <div className="mr-4 flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={onSelect}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Ảnh */}
        <Link to={`/product/${productId}`} className="flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={displayImage}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Thông tin */}
        <div className="ml-4 flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Tên & Variant (Chiếm 5 phần) */}
          <div className="md:col-span-5">
            <Link
              to={`/product/${productId}`}
              className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
            >
              {item.name}
            </Link>
            {item.variant && (
              <div className="mt-1 text-sm text-gray-600">
                <span className="capitalize">{item.variant.type}: </span>
                <span className="font-medium">{item.variant.value}</span>
              </div>
            )}
            <div className="mt-1 text-xs text-gray-500">Kho: {item.stock}</div>
          </div>

          {/* Giá (Chiếm 2 phần - Ẩn trên mobile) */}
          <div className="hidden md:block md:col-span-2 text-center font-medium text-gray-900">
            {formatPrice(item.price)}
          </div>

          {/* Số lượng (Chiếm 2 phần) */}
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => updateQuantity(productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                −
              </button>
              <span className="px-2 w-8 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(productId, item.quantity + 1)}
                disabled={item.quantity >= 99}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Thành tiền (Chiếm 2 phần - Ẩn trên mobile) */}
          <div className="hidden md:block md:col-span-2 text-center font-bold text-indigo-600">
            {formatPrice(itemTotal)}
          </div>

          {/* Nút xóa (Chiếm 1 phần) */}
          <div className="md:col-span-1 text-right md:text-center">
            <button
              onClick={() => removeFromCart(productId)}
              className="text-gray-400 hover:text-red-600 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Price View */}
      <div className="md:hidden mt-2 flex justify-between items-center pl-9">
        <span className="text-gray-500 text-sm">
          Đơn giá: {formatPrice(item.price)}
        </span>
        <span className="font-bold text-indigo-600">
          {formatPrice(itemTotal)}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
