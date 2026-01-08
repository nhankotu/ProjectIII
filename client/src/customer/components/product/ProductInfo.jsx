import React, { useState } from "react";

const ProductInfo = ({
  product,
  selectedQuantity,
  selectedVariant,
  onQuantityChange,
  onVariantSelect,
}) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Extract variants by type
  const colorVariants =
    product.variants?.filter((v) => v.type === "color") || [];
  const sizeVariants = product.variants?.filter((v) => v.type === "size") || [];
  const otherVariants =
    product.variants?.filter((v) => !["color", "size"].includes(v.type)) || [];

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onVariantSelect?.(color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    onVariantSelect?.(size);
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount =
        ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
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
          <span className="ml-2 font-medium text-gray-700">
            {product.rating || "0.0"}
          </span>
        </div>

        <span className="text-gray-400">•</span>

        <div className="text-gray-600">
          <span className="font-medium">{product.reviewCount || 0}</span>{" "}
          reviews
        </div>

        <span className="text-gray-400">•</span>

        <div className="text-gray-600">
          <span className="font-medium">{product.soldCount || 0}</span> sold
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-red-600">
            {formatPrice(product.price)}
          </span>

          {discount > 0 && (
            <>
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                -{discount}%
              </span>
            </>
          )}
        </div>

        {discount > 0 && (
          <p className="text-green-600 text-sm">
            You save {formatPrice(product.originalPrice - product.price)}!
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            product.stock > 10
              ? "bg-green-100 text-green-800"
              : product.stock > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.stock > 10
            ? "In Stock"
            : product.stock > 0
            ? `Only ${product.stock} left!`
            : "Out of Stock"}
        </span>

        {product.stock > 0 && (
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  ((product.soldCount || 0) /
                    (product.soldCount + product.stock)) *
                    100
                )}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Color Variants */}
      {colorVariants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Color</h3>
          <div className="flex flex-wrap gap-3">
            {colorVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleColorSelect(variant)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${
                  selectedColor?.id === variant.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: variant.value }}
                />
                <span>{variant.name}</span>
                {variant.priceDelta && variant.priceDelta > 0 && (
                  <span className="text-sm text-gray-600">
                    +{formatPrice(variant.priceDelta)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Variants */}
      {sizeVariants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleSizeSelect(variant)}
                className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${
                  selectedSize?.id === variant.id
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={variant.stock === 0}
                title={variant.stock === 0 ? "Out of stock" : variant.name}
              >
                {variant.name}
                {variant.stock === 0 && (
                  <div className="absolute w-full h-px bg-red-500 rotate-45"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Other Variants */}
      {otherVariants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Options</h3>
          <div className="space-y-3">
            {otherVariants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between"
              >
                <span>{variant.name}</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {variant.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Quantity</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onQuantityChange(-1)}
              disabled={selectedQuantity <= 1}
              className={`w-10 h-10 flex items-center justify-center ${
                selectedQuantity <= 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">−</span>
            </button>

            <input
              type="number"
              min="1"
              max={product.stock || 99}
              value={selectedQuantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= (product.stock || 99)) {
                  onQuantityChange(value - selectedQuantity);
                }
              }}
              className="w-16 h-10 text-center border-x border-gray-300 focus:outline-none"
            />

            <button
              onClick={() => onQuantityChange(1)}
              disabled={selectedQuantity >= (product.stock || 99)}
              className={`w-10 h-10 flex items-center justify-center ${
                selectedQuantity >= (product.stock || 99)
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">+</span>
            </button>
          </div>

          <span className="text-gray-600">{product.stock || 0} available</span>
        </div>
      </div>

      {/* Highlights */}
      {product.highlights && product.highlights.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Highlights</h3>
          <ul className="space-y-2">
            {product.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
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
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Product Tags */}
      {product.tags && product.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
