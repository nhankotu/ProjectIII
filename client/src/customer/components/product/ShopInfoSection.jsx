import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Store, MessageCircle, Star, ShoppingBag, MapPin } from "lucide-react";
import { productAPI as productService, shopAPI } from "../../services/api";

const ShopInfoSection = ({ sellerId, currentProductId }) => {
  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    const fetchShopInfo = async () => {
      if (!sellerId) return;
      try {
        const res = await shopAPI.getPublicInfo(sellerId);
        // api.js của bạn đã trả về response.data, nên res ở đây là body data
        if (res && res.success) {
          setShopData(res.data);
        }
      } catch (error) {
        console.error("Lỗi tải thông tin shop:", error);
      }
    };

    fetchShopInfo();
  }, [sellerId]);

  if (!shopData) return null;

  const { shop, products, totalProducts } = shopData;

  // Lọc sản phẩm hiện tại
  const otherProducts = products
    .filter((p) => p._id !== currentProductId)
    .slice(0, 4);

  // Xử lý ngày tham gia (Dùng joinedAt hoặc createdAt)
  const joinDate = shop.joinedAt || shop.createdAt;
  const joinYear = joinDate ? new Date(joinDate).getFullYear() : "N/A";

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm mb-12 mt-8">
      {/* --- HEADER SHOP --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              // ✅ Lấy đúng đường dẫn từ JSON của bạn
              src={shop.basicInfo?.logo}
              alt={shop.basicInfo?.shopName}
              className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover"
              // Xử lý nếu ảnh lỗi -> Hiện ảnh mặc định
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
              }}
            />
            {/* Chấm xanh online */}
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            {/* ✅ Lấy đúng tên Shop */}
            <h4 className="font-bold text-lg text-gray-900">
              {shop.basicInfo?.shopName || "Cửa hàng"}
            </h4>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1 text-orange-500 font-medium">
                {/* ✅ Lấy đúng Rating */}
                <Star size={14} fill="currentColor" /> {shop.avgRating || "0.0"}
              </span>
              <span className="flex items-center gap-1">
                <ShoppingBag size={14} /> {totalProducts} Sản phẩm
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> Tham gia {joinYear}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 flex items-center justify-center gap-2 transition">
            <MessageCircle size={18} /> Chat Ngay
          </button>

          <Link
            to={`/shop/${sellerId}`}
            className="flex-1 md:flex-none px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 flex items-center justify-center gap-2 transition"
          >
            <Store size={18} /> Xem Shop
          </Link>
        </div>
      </div>

      {/* --- SẢN PHẨM KHÁC --- */}
      {otherProducts.length > 0 && (
        <div className="mt-6">
          <h5 className="font-semibold text-gray-700 mb-4 uppercase text-xs tracking-wider">
            Sản phẩm khác từ Shop này
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherProducts.map((prod) => (
              <Link
                key={prod._id}
                to={`/product/${prod._id}`}
                className="group border rounded-lg overflow-hidden hover:shadow-md transition bg-white block"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <img
                    src={prod.thumbnail?.url || prod.thumbnail}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300?text=No+Image";
                    }}
                  />
                </div>
                <div className="p-3">
                  <h6 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-indigo-600 transition-colors">
                    {prod.name}
                  </h6>
                  <p className="text-red-600 font-bold text-sm mt-2">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(prod.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopInfoSection;
