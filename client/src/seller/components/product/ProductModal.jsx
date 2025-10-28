import React from "react";
import ProductForm from "./ProductForm";

const ProductModal = ({
  isOpen,
  onClose,
  title,
  children,
  isEditing = false,
  onSubmit,
  initialData,
  product,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          {children || (
            <ProductForm
              isEditing={isEditing}
              onSubmit={onSubmit}
              initialData={initialData}
              product={product}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
