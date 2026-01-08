import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const isProductInCart = isInCart(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image || "/api/placeholder/300/300"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition-all ${
            isProductInCart
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-white hover:bg-blue-500 hover:text-white text-gray-700"
          }`}
          title={isProductInCart ? "Already in cart" : "Add to cart"}
        >
          {isProductInCart ? (
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Price */}
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>

            {/* Original Price (if discounted) */}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 0)
                      ? "fill-current"
                      : "fill-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-600">
              ({product.reviewCount || 0})
            </span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {product.stock > 0 ? (
            <span className="text-sm text-green-600">
              In stock ({product.stock} left)
            </span>
          ) : (
            <span className="text-sm text-red-600">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
