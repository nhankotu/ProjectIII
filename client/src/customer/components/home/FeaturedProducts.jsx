import React, { useState, useEffect } from "react";
import ProductCard from "../common/ProductCard";
import { productService } from "../../services/productService";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", name: "All Products" },
    { id: "popular", name: "Most Popular" },
    { id: "trending", name: "Trending Now" },
    { id: "rated", name: "Top Rated" },
  ];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getFeaturedProducts();

        // --- LOGIC SỬA LỖI: Kiểm tra kỹ cấu trúc dữ liệu trả về ---
        let productArray = [];

        if (response && Array.isArray(response.data)) {
          productArray = response.data; // Trường hợp chuẩn: { data: [...] }
        } else if (Array.isArray(response)) {
          productArray = response; // Trường hợp trả thẳng mảng: [...]
        } else if (response && Array.isArray(response.products)) {
          productArray = response.products; // Trường hợp khác
        }

        // Cắt lấy 8 sản phẩm đầu tiên
        setProducts(productArray.slice(0, 8));
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // Nếu lỗi thì set mảng rỗng để không chết web
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Logic lọc sản phẩm theo tab
  const filteredProducts = products.filter((product) => {
    switch (activeTab) {
      case "popular":
        return (product.sales || 0) > 100; // Thêm check null an toàn
      case "trending":
        return product.tags?.includes("trending");
      case "rated":
        return (product.rating || 0) >= 4.5;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <section className="py-12">
        <div className="animate-pulse container mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ⭐ Featured Products
          </h2>
          <p className="text-gray-600">
            Handpicked selection of quality products
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          // SỬA: Dùng product._id nếu id bị null (đặc trưng MongoDB)
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">Try selecting a different category</p>
        </div>
      )}

      {/* View All Button */}
      <div className="text-center mt-12">
        <button className="inline-flex items-center space-x-2 border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors font-medium">
          <span>View All Products</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default FeaturedProducts;
