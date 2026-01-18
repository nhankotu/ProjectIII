import React, { useState, useEffect } from "react";
import ProductCard from "../product/ProductCard";
import { productAPI as productService } from "../../services/api";

const FlashSaleSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake Timer logic
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getFlashSale();

        // --- LOGIC XỬ LÝ DỮ LIỆU ĐÚNG CHUẨN ---
        // Backend trả về: { success: true, data: [ { title: "...", products: [...] } ] }
        const campaigns = response.data?.data || response.data || [];

        let allProducts = [];

        // 1. Nếu có chiến dịch Flash Sale -> Lấy sản phẩm từ bên trong ra
        if (Array.isArray(campaigns) && campaigns.length > 0) {
          // Flatten: Gom tất cả sản phẩm của các chiến dịch lại
          allProducts = campaigns.flatMap(
            (campaign) => campaign.products || []
          );
        }

        // 2. FALLBACK: Nếu không có Flash Sale -> Lấy sản phẩm nổi bật (Featured)
        if (allProducts.length === 0) {
          // console.warn("Flash Sale trống! Đang lấy sản phẩm thường demo...");
          try {
            const fallbackRes = await productService.getFeatured();
            const fallbackData =
              fallbackRes.data?.data || fallbackRes.data || [];
            allProducts = Array.isArray(fallbackData) ? fallbackData : [];
          } catch (err) {
            console.error("Lỗi lấy dữ liệu fallback");
          }
        }

        // Lấy tối đa 6-10 sản phẩm để hiển thị đẹp
        setProducts(allProducts.slice(0, 10));
      } catch (error) {
        console.error("Lỗi fetch Flash Sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();

    // Timer Logic (Giữ nguyên)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 animate-pulse">
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

  // Ẩn section nếu không có sản phẩm nào
  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-red-50 to-white border-t border-red-100">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="mr-2 text-red-600 animate-pulse text-4xl">
                ⚡
              </span>
              FLASH SALE
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Nhanh tay săn deal sốc - Số lượng có hạn!
            </p>
          </div>

          {/* Countdown Timer UI */}
          <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 flex items-center gap-3">
            {["Giờ", "Phút", "Giây"].map((label, idx) => {
              const val =
                idx === 0
                  ? timeLeft.hours
                  : idx === 1
                  ? timeLeft.minutes
                  : timeLeft.seconds;
              return (
                <div key={label} className="text-center">
                  <div className="bg-red-600 text-white rounded p-2 min-w-[3rem] text-xl font-bold">
                    {String(val).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={product._id || index}
              product={product}
              // ✅ QUAN TRỌNG: Kích hoạt chế độ hiển thị Flash Sale cho ProductCard
              isFlashSale={true}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <a
            href="/flash-sale"
            className="inline-flex items-center space-x-2 bg-white text-red-600 border border-red-600 px-8 py-3 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-md hover:shadow-lg font-medium group"
          >
            <span>Xem tất cả Deal</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
          </a>
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;
