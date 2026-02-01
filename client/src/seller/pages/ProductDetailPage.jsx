import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import {
  ArrowLeft,
  Edit,
  Package,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Image as ImageIcon,
} from "lucide-react";

// Import các sub-components
import GeneralInfo from "../components/productdetail/GeneralInfo";
import VariantsList from "../components/productdetail/VariantsList";
import MediaGallery from "../components/productdetail/MediaGallery";
import ProductReviews from "../components/productdetail/ProductReviews";
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProductDetail(id);
  const [activeTab, setActiveTab] = useState("content"); // 'content' hoặc 'reviews'

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">SKU: {product.sku || "N/A"}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/seller/products/edit/${id}`)}
          className="btn-primary flex items-center gap-2"
        >
          <Edit size={18} /> Chỉnh sửa
        </button>
      </div>

      {/* Điều hướng 2 Tab chính */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 pb-3 font-bold transition-all ${
            activeTab === "content"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          <LayoutDashboard size={18} /> Nội dung sản phẩm
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 pb-3 font-bold transition-all ${
            activeTab === "reviews"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          <MessageCircle size={18} /> Đánh giá ({product.reviewCount || 0})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "content" ? (
            <>
              {/* Gộp chung 3 phần vào 1 view */}
              <MediaGallery product={product} />
              <VariantsList product={product} />
              <GeneralInfo product={product} />
            </>
          ) : (
            <ProductReviews productId={id} />
          )}
        </div>

        {/* Sidebar Thống kê giữ nguyên */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">Hiệu suất</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Đánh giá TB:</span>
                <span className="font-bold text-yellow-500">
                  {product.ratingAverage}/5 ⭐
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Đã bán:</span>
                <span className="font-medium">{product.sold}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
