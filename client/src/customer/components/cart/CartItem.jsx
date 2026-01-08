import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeFromCart(item.id);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        {/* Product Image */}
        <Link to={`/product/${item.id}`} className="flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={item.image || "/api/placeholder/100/100"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="ml-4 flex-grow">
          <div className="flex justify-between">
            <div>
              <Link
                to={`/product/${item.id}`}
                className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>

              {/* Variant Info */}
              {item.variant && (
                <div className="mt-1 text-sm text-gray-600">
                  <span className="capitalize">{item.variant.type}: </span>
                  <span className="font-medium">{item.variant.value}</span>
                </div>
              )}

              {/* Stock Status */}
              <div className="mt-1">
                <span
                  className={`text-sm ${
                    item.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Mobile: Price & Remove */}
            <div className="md:hidden flex flex-col items-end">
              <span className="font-bold text-gray-900">
                {formatPrice(item.price)}
              </span>
              <button
                onClick={handleRemove}
                className="mt-2 text-red-600 hover:text-red-700"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border ${
                  item.quantity <= 1
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">−</span>
              </button>

              <input
                type="number"
                min="1"
                max="99"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-12 h-8 text-center border-y border-gray-300 focus:outline-none"
              />

              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= 99}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border ${
                  item.quantity >= 99
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">+</span>
              </button>

              <button
                onClick={handleRemove}
                className="ml-4 text-sm text-red-600 hover:text-red-700 md:hidden"
              >
                Remove
              </button>
            </div>

            {/* Desktop: Price & Total */}
            <div className="hidden md:flex items-center space-x-8">
              <span className="w-24 text-center font-medium text-gray-900">
                {formatPrice(item.price)}
              </span>

              <span className="w-24 text-center font-bold text-gray-900">
                {formatPrice(itemTotal)}
              </span>

              <button
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700"
                title="Remove item"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
