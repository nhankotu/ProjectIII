import React, { useState, useEffect } from "react";
import ProductCard from "../components/common/ProductCard";
import { productService } from "../services/productService";

const FlashSalePage = () => {
  const [flashSaleItems, setFlashSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getFlashSaleProducts();

        // 1. Kiểm tra cấu trúc dữ liệu trả về
        const campaigns = response.data?.data || response.data || [];

        let allProducts = [];

        if (Array.isArray(campaigns) && campaigns.length > 0) {
          // 2. Lấy sản phẩm từ bên trong các chiến dịch (FLATTEN)
          allProducts = campaigns.flatMap((campaign) => {
            return campaign.products || [];
          });
        }

        // 3. Fallback: Nếu không có Flash Sale nào, lấy sản phẩm thường demo
        if (allProducts.length === 0) {
          // console.warn("Flash sale trống, lấy sản phẩm thường demo...");
          // const fallback = await productService.getFeaturedProducts();
          // const fallbackData = fallback.data?.data || fallback.data || [];
          // allProducts = Array.isArray(fallbackData) ? fallbackData : [];

          // Tốt nhất là để trống để biết là không có Sale, thay vì hiện lung tung
          allProducts = [];
        }

        setFlashSaleItems(allProducts);
      } catch (error) {
        console.error("Lỗi tải trang Flash Sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();

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
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse text-red-600 font-bold text-xl">
          Đang tải Flash Sale...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 min-h-screen pb-12">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12 mb-8 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-bounce drop-shadow-md">
            ⚡ FLASH SALE ⚡
          </h1>
          <p className="text-red-100 text-lg mb-6">
            Săn deal giá sốc - Số lượng có hạn
          </p>

          {/* Countdown Clock */}
          <div className="flex justify-center space-x-4">
            {["Giờ", "Phút", "Giây"].map((label, idx) => {
              const val =
                idx === 0
                  ? timeLeft.hours
                  : idx === 1
                  ? timeLeft.minutes
                  : timeLeft.seconds;
              return (
                <div
                  key={label}
                  className="bg-white text-red-600 rounded-lg p-3 w-20 shadow-md transform hover:scale-105 transition-transform"
                >
                  <div className="text-3xl font-bold font-mono">
                    {val.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs font-medium uppercase">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="container mx-auto px-4">
        {flashSaleItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <span className="text-6xl mb-4 block">😭</span>
            <h3 className="text-xl font-bold text-gray-700">Tiếc quá!</h3>
            <p className="text-gray-500">
              Hiện tại chưa có chương trình Flash Sale nào đang diễn ra.
            </p>
            <p className="text-gray-500">Vui lòng quay lại sau nhé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {flashSaleItems.map((item, index) => (
              <ProductCard
                key={item._id || index}
                product={item}
                // ✅ QUAN TRỌNG: Bật chế độ hiển thị Flash Sale
                isFlashSale={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSalePage;
