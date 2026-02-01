import React from "react";

const MediaGallery = ({ product }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-gray-800 mb-4">Thư viện hình ảnh</h3>
    {product.images?.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {product.images.map((img, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg overflow-hidden border border-gray-200 group"
          >
            <img
              src={img.url}
              alt={`Product image ${i}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400 text-sm italic">Sản phẩm chưa có hình ảnh.</p>
    )}
  </div>
);

export default MediaGallery;
