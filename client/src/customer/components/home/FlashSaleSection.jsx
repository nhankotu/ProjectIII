import React, { useState, useEffect } from "react";
import ProductCard from "../common/ProductCard";
// Đảm bảo đường dẫn import đúng với cấu trúc thư mục của bạn
import { productService } from "../../services/productService";

const FlashSaleSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 0,
    seconds: 0,
  });

  // Fetch flash sale products
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getFlashSaleProducts();
        console.log("Dữ liệu Flash Sale raw:", response);

        let productArray = [];

        // --- 1. LOGIC PHÒNG THỦ: Kiểm tra kỹ các trường hợp trả về ---
        if (response && Array.isArray(response.data)) {
          // Trường hợp chuẩn: { success: true, data: [...] }
          productArray = response.data;
        } else if (Array.isArray(response)) {
          // Trường hợp backend trả thẳng mảng: [...]
          productArray = response;
        } else if (response && Array.isArray(response.products)) {
          // Trường hợp khác: { products: [...] }
          productArray = response.products;
        }

        // --- 2. FALLBACK: Nếu không có Flash Sale nào, lấy tạm sản phẩm thường để test giao diện ---
        if (productArray.length === 0) {
          console.warn(
            "⚠️ Flash Sale trống! Đang lấy sản phẩm thường để test giao diện..."
          );
          try {
            const fallbackRes = await productService.getFeaturedProducts();
            if (fallbackRes && Array.isArray(fallbackRes.data)) {
              productArray = fallbackRes.data;
            } else if (Array.isArray(fallbackRes)) {
              productArray = fallbackRes;
            }
          } catch (err) {
            console.error("Không lấy được dữ liệu fallback");
          }
        }

        // Cập nhật state (chỉ lấy 6 sản phẩm đầu)
        setProducts(productArray.slice(0, 6));
      } catch (error) {
        console.error("Error fetching flash sale products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          // Reset lại timer cho đẹp (Demo loop)
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="animate-pulse container mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Nếu vẫn không có sản phẩm nào thì ẩn section
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-r from-red-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="mr-2 text-red-600 animate-pulse">🔥</span> Flash
              Sale
            </h2>
            <p className="text-gray-600">
              Limited time offers. Hurry up before they're gone!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mt-4 md:mt-0 bg-white border border-red-100 shadow-sm rounded-xl p-4">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="bg-red-600 text-white rounded p-2 min-w-[3rem]">
                  <span className="text-xl font-bold">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Hrs</div>
              </div>
              <span className="text-2xl font-bold text-red-600 pb-6">:</span>
              <div className="text-center">
                <div className="bg-red-600 text-white rounded p-2 min-w-[3rem]">
                  <span className="text-xl font-bold">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Mins</div>
              </div>
              <span className="text-2xl font-bold text-red-600 pb-6">:</span>
              <div className="text-center">
                <div className="bg-red-600 text-white rounded p-2 min-w-[3rem]">
                  <span className="text-xl font-bold">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Secs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-xl font-medium transform hover:-translate-y-0.5">
            <span>View All Flash Deals</span>
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
      </div>
    </section>
  );
};

export default FlashSaleSection;
