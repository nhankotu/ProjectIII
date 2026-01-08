import React, { useState, useEffect } from "react";
import ProductCard from "../components/common/ProductCard";
import { productService } from "../services/productService";

const FlashSalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake timer cho đẹp (chạy ngược từ 12h)
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

        // Logic kiểm tra dữ liệu an toàn (như đã sửa ở các file trước)
        let data = [];
        if (response && Array.isArray(response.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        } else if (response && Array.isArray(response.products)) {
          data = response.products;
        } else if (response?.success && Array.isArray(response.data)) {
          data = response.data;
        }

        // Nếu không có dữ liệu thật, lấy tạm sản phẩm thường để test (Fallback)
        if (data.length === 0) {
          console.warn("Flash sale trống, lấy sản phẩm thường demo...");
          const fallback = await productService.getFeaturedProducts();
          if (fallback && Array.isArray(fallback.data)) data = fallback.data;
          else if (Array.isArray(fallback)) data = fallback;
        }

        setProducts(data);
      } catch (error) {
        console.error("Lỗi tải trang Flash Sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();

    // Timer logic
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
        <div className="animate-pulse">Đang tải Flash Sale...</div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 min-h-screen pb-12">
      {/* Banner Header */}
      <div className="bg-red-600 text-white py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-bounce">
            ⚡ FLASH SALE ⚡
          </h1>
          <p className="text-red-100 text-lg mb-6">
            Săn deal giá sốc - Số lượng có hạn
          </p>

          {/* Countdown Clock */}
          <div className="flex justify-center space-x-4">
            <div className="bg-white text-red-600 rounded-lg p-3 w-20">
              <div className="text-3xl font-bold">
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <div className="text-xs">Giờ</div>
            </div>
            <div className="bg-white text-red-600 rounded-lg p-3 w-20">
              <div className="text-3xl font-bold">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-xs">Phút</div>
            </div>
            <div className="bg-white text-red-600 rounded-lg p-3 w-20">
              <div className="text-3xl font-bold">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-xs">Giây</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="container mx-auto px-4">
        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Chưa có chương trình Flash Sale nào.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSalePage;
