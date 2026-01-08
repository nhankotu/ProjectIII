// src/pages/admin/ProductDetailPage.jsx
import React from "react";

import ProductDetail from "../components/ProductDetail";

const ProductDetailPage = () => {
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <ProductDetail />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductDetailPage;
