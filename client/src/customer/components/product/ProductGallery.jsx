import React from "react";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";

const ProductGallery = ({ product }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Images */}
      <div>
        <ProductImages images={product.images} productName={product.name} />
      </div>

      {/* Right Column - Info & Actions */}
      <div className="space-y-6">
        <ProductInfo product={product} />
        <ProductActions product={product} />
      </div>
    </div>
  );
};

export default ProductGallery;
