import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { productAPI as productService } from "../../services/api";

const RelatedProducts = ({ productId, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);

        let relatedProducts;
        if (categoryId) {
          // 1. Ưu tiên lấy sản phẩm cùng danh mục (Related)
          // Tên mới: getRelated (hoặc getByCategory)
          relatedProducts = await productService.getRelated(categoryId);
        } else if (categoryId) {
          // (Logic của bạn đang lặp lại check categoryId, tôi gộp vào trường hợp trên nhé)
          // Nếu muốn gọi rõ ràng kèm limit:
          relatedProducts = await productService.getByCategory(categoryId, {
            limit: 8,
          });
        } else {
          // 2. Nếu không có danh mục thì lấy sản phẩm nổi bật
          // Tên mới: getFeatured
          relatedProducts = await productService.getFeatured();
        }

        setProducts(
          Array.isArray(relatedProducts) ? relatedProducts.slice(0, 8) : []
        );
      } catch (error) {
        console.error("Error fetching related products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, categoryId]);

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          You Might Also Like
        </h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          View All →
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
