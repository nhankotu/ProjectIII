import React, { useEffect } from "react";
import ProductForm from "./ProductForm";

const ProductModal = ({
  isOpen,
  onClose,
  title,
  children,
  isEditing = false,
  onSubmit,
  product,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Ngăn cuộn trang web khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay làm mờ nền */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose} // Bấm ra ngoài thì đóng
      ></div>

      {/* Container Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col z-10 transform transition-all animate-fade-in-up">
        {/* 1. Header (Cố định) */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white rounded-t-xl shrink-0">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-0 bg-gray-50">
          {children || (
            <ProductForm
              isEditing={isEditing}
              onSubmit={onSubmit}
              product={product} // ✅ Truyền đúng tên prop mà ProductForm cần
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
