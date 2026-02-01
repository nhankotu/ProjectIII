import React, { useState, useEffect } from "react";

const ProductInfo = ({
  product,
  selectedQuantity,
  selectedVariant, // Biến thể đã tìm thấy (từ cha truyền xuống)
  onQuantityChange,
  onVariantSelect, // Hàm báo cho cha biết đã tìm thấy biến thể nào
}) => {
  // State lưu các lựa chọn hiện tại của user. VD: { "Màu": "Trắng", "Size": "L" }
  const [currentSelections, setCurrentSelections] = useState({});

  // Reset selection khi đổi sản phẩm
  useEffect(() => {
    setCurrentSelections({});
  }, [product._id]);

  // Helper format tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Tính % giảm giá
  const calculateDiscount = (original, current) => {
    if (original && original > current) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  };

  // Giá hiển thị: Ưu tiên giá của Variant nếu đã chọn, không thì lấy giá gốc
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayOriginalPrice = product.originalPrice; // Variant thường ít khi có originalPrice riêng trong model đơn giản, dùng chung của Product
  const discount = calculateDiscount(displayOriginalPrice, displayPrice);

  // Stock hiển thị
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Xử lý khi user click chọn thuộc tính (Màu/Size)
  const handleAttributeSelect = (attributeName, value) => {
    const newSelections = { ...currentSelections, [attributeName]: value };
    setCurrentSelections(newSelections);

    // 🔥 LOGIC QUAN TRỌNG:
    // Sau khi chọn xong, thử tìm xem có variant nào khớp với bộ options này không
    // Cần đảm bảo dữ liệu `variants` trong DB có trường `options` đầy đủ
    if (product.variants && product.variants.length > 0) {
      const foundVariant = product.variants.find((v) => {
        // So sánh options của variant với selection của user
        // Lưu ý: Cần so khớp tất cả các keys
        if (!v.options) return false;

        // Kiểm tra xem variant này có chứa tất cả các lựa chọn hiện tại không
        const isMatch = Object.keys(newSelections).every(
          (key) => v.options[key] === newSelections[key]
        );

        // Và đảm bảo số lượng keys khớp nhau (để tránh trường hợp chọn thiếu)
        // (Tuỳ logic, ở đây mình tìm match gần nhất trước)
        return isMatch;
      });

      // Nếu tìm thấy (hoặc user đang chọn dở), gửi lên cha
      // Ở đây logic tốt nhất là: Nếu User chọn ĐỦ thuộc tính -> Gửi variant hoàn chỉnh
      // Nếu chưa đủ -> Gửi null để disable nút mua

      const totalAttributes = product.variantAttributes?.length || 0;
      const selectedCount = Object.keys(newSelections).length;

      if (foundVariant && selectedCount === totalAttributes) {
        onVariantSelect(foundVariant);
      } else {
        onVariantSelect(null); // Chưa chọn xong
      }
    }
  };

  // Kiểm tra xem một giá trị thuộc tính có đang được chọn không
  const isSelected = (name, value) => currentSelections[name] === value;

  return (
    <div className="space-y-6">
      {/* 1. Tên sản phẩm */}
      <h1 className="text-3xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* 2. Rating & Sold (Dùng field mới: ratingAverage, sold) */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.ratingAverage || 0)
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
            {product.ratingAverage || "0.0"}
          </span>
        </div>

        <span className="text-gray-300">|</span>

        <div className="text-gray-600">
          <span className="font-medium text-black">
            {product.reviewCount || 0}
          </span>{" "}
          đánh giá
        </div>

        <span className="text-gray-300">|</span>

        <div className="text-gray-600">
          <span className="font-medium text-black">{product.sold || 0}</span> đã
          bán
        </div>
      </div>

      {/* 3. Giá tiền */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold text-red-600">
            {formatPrice(displayPrice)}
          </span>

          {discount > 0 && (
            <>
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(displayOriginalPrice)}
              </span>
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase">
                Giảm {discount}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* 4. Render các thuộc tính (Màu, Size...) từ variantAttributes */}
      {product.variantAttributes && product.variantAttributes.length > 0 && (
        <div className="space-y-5">
          {product.variantAttributes.map((attr) => (
            <div key={attr._id || attr.name}>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {attr.name}:{" "}
                <span className="text-gray-500 font-normal">
                  {currentSelections[attr.name]}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {attr.values.map((value) => {
                  const active = isSelected(attr.name, value);

                  // Logic hiển thị nút khác nhau tuỳ tên thuộc tính (Optional)
                  // Nếu là "Màu" hoặc "Color" thì hiển thị kiểu khác nếu muốn (cần map mã màu hex)
                  // Ở đây mình làm nút chuẩn chung cho dễ.

                  return (
                    <button
                      key={value}
                      onClick={() => handleAttributeSelect(attr.name, value)}
                      className={`px-4 py-2 rounded border text-sm font-medium transition-all ${
                        active
                          ? "border-blue-600 text-blue-600 bg-blue-50 ring-1 ring-blue-600"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Số lượng & Kho */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Số lượng</h3>
        <div className="flex items-center gap-6">
          {/* Bộ chọn số lượng */}
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => onQuantityChange(-1)}
              disabled={selectedQuantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              -
            </button>
            <input
              type="number"
              className="w-14 h-10 text-center border-x border-gray-300 focus:outline-none"
              value={selectedQuantity}
              readOnly
            />
            <button
              onClick={() => onQuantityChange(1)}
              disabled={selectedQuantity >= displayStock}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Hiển thị tồn kho */}
          <div className="text-sm text-gray-500">
            {displayStock > 0 ? (
              <span>
                Còn <span className="font-bold text-black">{displayStock}</span>{" "}
                sản phẩm
              </span>
            ) : (
              <span className="text-red-500 font-medium">Hết hàng</span>
            )}
          </div>
        </div>
      </div>

      {/* 6. Tags & Highlights (Nếu có) */}
      {product.tags && product.tags.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
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
