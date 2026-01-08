import React, { useState, useEffect } from "react";
import ProductCard from "../common/ProductCard";
import { productService } from "../../services/productService";

const RelatedProducts = ({ productId, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);

        let relatedProducts;
        if (productId) {
          // Fetch related products by product ID
          relatedProducts = await productService.getRelatedProducts(productId);
        } else if (categoryId) {
          // Fetch products from same category
          relatedProducts = await productService.getProductsByCategory(
            categoryId,
            { limit: 8 }
          );
        } else {
          // Fetch featured products as fallback
          relatedProducts = await productService.getFeaturedProducts();
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
