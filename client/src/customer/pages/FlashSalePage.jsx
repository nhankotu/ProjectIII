import React, { useState, useEffect } from "react";
import ProductCard from "../components/product/ProductCard";
import { productAPI as productService } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Clock } from "lucide-react";

const FlashSalePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        setLoading(true);
        const response = await productService.getFlashSale();
        setCampaigns(response.data || []);
      } catch (error) {
        console.error("Lỗi tải Flash Sale:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSale();
  }, []);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, "0")}:00`;
  };

  const getStatusText = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now >= start && now <= end) return "Đang diễn ra";
    if (now < start) return "Sắp diễn ra";
    return "Đã kết thúc";
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Banner */}
      <div className="bg-red-600 py-8 text-center text-white mb-6">
        <h1 className="text-4xl font-black italic uppercase animate-pulse">
          ⚡ Flash Sale ⚡
        </h1>
        <p className="mt-2 opacity-90 font-medium">Săn deal giá sốc mỗi ngày</p>
      </div>

      <div className="container mx-auto px-4">
        {/* Timeline Tabs */}
        {campaigns.length > 0 ? (
          <>
            <div className="flex overflow-x-auto gap-3 mb-8 pb-4 justify-center scrollbar-hide">
              {campaigns.map((camp, index) => {
                const isActive = index === activeTab;
                return (
                  <button
                    key={camp.flashSaleId || index}
                    onClick={() => setActiveTab(index)}
                    className={`flex-shrink-0 min-w-[150px] px-6 py-4 rounded-2xl text-center transition-all border-2 
                      ${
                        isActive
                          ? "bg-red-600 text-white border-red-600 shadow-xl scale-105"
                          : "bg-white text-gray-600 border-transparent hover:border-red-200 shadow-sm"
                      }`}
                  >
                    <div className="text-xl font-extrabold">
                      {formatTime(camp.startTime)}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider font-bold opacity-80 mt-1">
                      {getStatusText(camp.startTime, camp.endTime)}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {campaigns[activeTab]?.products?.length > 0 ? (
                campaigns[activeTab].products.map((item) => (
                  <ProductCard
                    key={item.productId}
                    // 🔥 SỬA LỖI TẠI ĐÂY: Chuẩn hóa dữ liệu để ProductCard nhận diện được ID
                    product={{
                      ...item,
                      _id: item.productId, // Gán productId vào _id để Link hoạt động
                    }}
                    isFlashSale={true}
                  />
                ))
              ) : (
                <div className="col-span-full bg-white rounded-2xl py-16 text-center text-gray-400 shadow-sm border border-dashed border-gray-300">
                  <ShoppingBag size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium">
                    Không có sản phẩm nào trong khung giờ này.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Clock size={64} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Hiện tại chưa có chương trình Flash Sale nào
            </h3>
            <p className="text-gray-400">
              Hẹn gặp lại bạn vào các khung giờ tiếp theo!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSalePage;
