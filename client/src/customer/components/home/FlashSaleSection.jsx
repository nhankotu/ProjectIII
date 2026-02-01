import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";
import { productAPI as productService } from "../../services/api";
import { Clock } from "lucide-react";

const FlashSaleSection = () => {
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  // Timer State
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        setLoading(true);
        const response = await productService.getFlashSale();
        const campaigns = response.data || [];

        // Lấy chiến dịch đầu tiên (đang diễn ra và sắp kết thúc nhất)
        if (campaigns.length > 0) {
          setActiveCampaign(campaigns[0]);
        }
      } catch (error) {
        console.error("Failed to fetch flash sale", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

  // Countdown Logic
  useEffect(() => {
    if (!activeCampaign) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(activeCampaign.endTime).getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        // Có thể reload lại API để lấy campaign tiếp theo
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60)); // Cho phép > 24h
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCampaign]);

  if (loading)
    return <div className="h-64 bg-gray-50 animate-pulse m-4 rounded-xl" />;

  // Nếu không có Flash Sale nào -> Ẩn section
  if (!activeCampaign || activeCampaign.products.length === 0) return null;

  return (
    <section className="py-8 bg-white mb-4">
      <div className="container mx-auto px-4">
        {/* Header: Logo + Timer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3655/3655583.png"
                className="w-8 h-8 animate-bounce"
                alt="flash"
              />
              <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter italic">
                FLASH SALE
              </h2>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-1">
              <div className="bg-black text-white px-2 py-1 rounded font-bold min-w-[32px] text-center">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <span className="font-bold">:</span>
              <div className="bg-black text-white px-2 py-1 rounded font-bold min-w-[32px] text-center">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <span className="font-bold">:</span>
              <div className="bg-black text-white px-2 py-1 rounded font-bold min-w-[32px] text-center">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>

          <Link
            to="/flash-sale"
            className="text-sm font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1"
          >
            Xem tất cả <span className="text-lg">›</span>
          </Link>
        </div>

        {/* Product List (Lấy 6 sản phẩm đầu) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activeCampaign.products.slice(0, 6).map((item) => (
            <ProductCard
              key={item.productId}
              product={item}
              isFlashSale={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;
