import React, { useState } from "react";
import { useCart } from "./contexts/CartContext";

const Product = ({ product }) => {
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("1");
  const { addToCart } = useCart();

  const openQuantityModal = () => {
    setInputValue("1");
    setIsQuantityModalOpen(true);
  };

  const closeQuantityModal = () => {
    setIsQuantityModalOpen(false);
  };

  const openDetailModal = () => {
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  const handleAddToCart = () => {
    const quantity = Number(inputValue);
    if (quantity < 1 || isNaN(quantity)) {
      alert("Vui lòng nhập số lượng hợp lệ (lớn hơn hoặc bằng 1)");
      return;
    }
    addToCart({ ...product, quantity });
    setIsQuantityModalOpen(false);
    setIsDetailModalOpen(false);
  };

  return (
    <div>
      {/* Card sản phẩm */}
      <div
        className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition flex flex-col"
        onClick={openDetailModal}
      >
        <img
          src={product.imageURL}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="text-lg font-semibold mt-2 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 min-h-[3em]">
          {product.description}
        </p>

        <div className="flex flex-col items-center mt-auto mt-4">
          <span className="text-yellow-600 font-bold text-lg">
            {formatPrice(product.price)}
          </span>
          <button
            className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-400 w-full"
            onClick={(e) => {
              e.stopPropagation();
              openQuantityModal();
            }}
          >
            🛒 Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Modal chọn số lượng */}
      {isQuantityModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          onClick={closeQuantityModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 font-semibold text-lg">Chọn số lượng</h2>
            <p className="mb-4 font-medium">{product.name}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() =>
                  setInputValue((prev) => Math.max(1, Number(prev) - 1))
                }
                className="text-2xl px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                ▼
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setInputValue(val);
                  } else {
                    const num = Number(val);
                    if (!isNaN(num) && num >= 1) {
                      setInputValue(num);
                    }
                  }
                }}
                className="w-20 h-12 text-center text-2xl border rounded appearance-none focus:outline-none"
                style={{ MozAppearance: "textfield" }}
              />
              <button
                onClick={() =>
                  setInputValue((prev) => Math.max(1, Number(prev) + 1))
                }
                className="text-2xl px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                ▲
              </button>
            </div>

            <div className="mt-4 flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={closeQuantityModal}
              >
                Hủy
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={handleAddToCart}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết sản phẩm */}
      {isDetailModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeDetailModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw", // tối đa 90% chiều rộng màn hình
              maxHeight: "90vh", // tối đa 90% chiều cao màn hình
              minWidth: "50vw",
              width: "auto",
              height: "auto",
            }}
          >
            <button
              onClick={closeDetailModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={product.imageURL}
              alt={product.name}
              style={{
                maxWidth: "90vw", // không vượt quá 90% chiều rộng viewport
                maxHeight: "80vh", // không vượt quá 80% chiều cao viewport
                width: "auto",
                height: "auto",
              }}
              className="rounded mx-auto"
            />
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-yellow-600 font-bold text-xl mb-4">
              {formatPrice(product.price)}
            </p>
            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-400"
              onClick={() => {
                closeDetailModal();
                openQuantityModal();
              }}
            >
              🛒 Thêm vào giỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
