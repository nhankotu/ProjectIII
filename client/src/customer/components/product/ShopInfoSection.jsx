// ShopInfoSection.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import {
  Store,
  MessageCircle,
  Star,
  ShoppingBag,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { shopAPI, chatAPI } from "../../services/api"; // Thêm chatAPI
import { useAuth } from "../../../contexts/AuthContext"; // Thêm useAuth

const ShopInfoSection = ({ sellerId, currentProductId }) => {
  const [shopData, setShopData] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopInfo = async () => {
      if (!sellerId) return;
      try {
        const res = await shopAPI.getPublicInfo(sellerId);

        // Xử lý dữ liệu trả về cho an toàn
        const data = res.data || res;
        if (data && data.shop) {
          setShopData(data);
        }
      } catch (error) {
        console.error("Lỗi tải thông tin shop:", error);
      }
    };

    fetchShopInfo();
  }, [sellerId]);

  // 🔥 HÀM XỬ LÝ CHAT (Copy logic từ ShopPage sang)
  const handleChatWithShop = async () => {
    if (!shopData?.shop) return;

    if (!user) {
      // Lưu lại link hiện tại để login xong quay lại
      const currentPath = window.location.pathname;
      navigate("/login", { state: { from: currentPath } });
      return;
    }

    // Lấy ID User của chủ shop (Ưu tiên lấy từ ownerInfo nếu có populate)
    const ownerId = shopData.shop.ownerInfo?._id || shopData.shop.owner;

    if (user._id === ownerId) {
      alert("Bạn không thể chat với chính mình!");
      return;
    }

    try {
      setLoadingChat(true);
      const res = await chatAPI.createOrGetConversation(ownerId);

      if (res.data) {
        // Bắn sự kiện mở Widget
        const event = new CustomEvent("OPEN_CHAT_WIDGET", {
          detail: res.data,
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Lỗi chat:", error);
    } finally {
      setLoadingChat(false);
    }
  };

  if (!shopData) return null;

  const { shop, products, totalProducts } = shopData;

  // Lọc sản phẩm hiện tại ra khỏi danh sách gợi ý
  const otherProducts = products
    .filter((p) => p._id !== currentProductId)
    .slice(0, 4);

  // Xử lý ngày tham gia
  const joinDate = shop.joinedAt || shop.createdAt;
  const joinYear = joinDate
    ? new Date(joinDate).toLocaleDateString("vi-VN")
    : "N/A";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-12 mt-8">
      {/* --- HEADER SHOP --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Link to={`/shop/${shop._id}`}>
              <img
                // ✅ SỬA 1: Lấy đúng field logo
                src={shop.logo || "https://via.placeholder.com/150"}
                alt={shop.name}
                className="w-16 h-16 rounded-full border border-gray-200 object-cover p-0.5 bg-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
              />
            </Link>
            {/* Badge Mall nếu có */}
            {shop.isMall && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                MALL
              </span>
            )}
          </div>

          <div>
            {/* ✅ SỬA 2: Lấy đúng field name */}
            <h4 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors">
              <Link to={`/shop/${shop._id}`}>{shop.name || "Cửa hàng"}</Link>
            </h4>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1 text-orange-500 font-medium">
                {/* ✅ SỬA 3: Lấy rating từ avgRating hoặc tính toán */}
                <Star size={14} fill="currentColor" />{" "}
                {shop.avgRating || shop.ratingAverage || "5.0"}
              </span>
              <span className="flex items-center gap-1">
                <ShoppingBag size={14} /> {totalProducts} Sản phẩm
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />{" "}
                {shop.contact?.address ? "Việt Nam" : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* 🔥 BUTTON CHAT ĐÃ GẮN HÀM XỬ LÝ */}
          <button
            onClick={handleChatWithShop}
            disabled={loadingChat}
            className="flex-1 md:flex-none px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm font-bold hover:bg-green-50 flex items-center justify-center gap-2 transition disabled:opacity-70"
          >
            <MessageCircle size={18} />
            {loadingChat ? "Kết nối..." : "Chat Ngay"}
          </button>

          <Link
            to={`/shop/${shop._id}`} // Dùng ID của shop
            className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 flex items-center justify-center gap-2 transition"
          >
            <Store size={18} /> Xem Shop
          </Link>
        </div>
      </div>

      {/* --- SẢN PHẨM KHÁC --- */}
      {otherProducts.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-end mb-4">
            <h5 className="font-bold text-gray-700 uppercase text-xs tracking-wider flex items-center gap-2">
              <ShoppingBag size={16} /> Sản phẩm khác của Shop
            </h5>
            <Link
              to={`/shop/${shop._id}`}
              className="text-xs text-blue-600 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherProducts.map((prod) => (
              <Link
                key={prod._id}
                to={`/product/${prod._id}`} // Link sang chi tiết sản phẩm khác
                className="group border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all bg-white block"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <img
                    src={prod.thumbnail?.url || prod.thumbnail}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300?text=No+Image";
                    }}
                  />
                </div>
                <div className="p-3">
                  <h6 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors mb-1">
                    {prod.name}
                  </h6>
                  <div className="flex items-center justify-between">
                    <p className="text-red-600 font-bold text-sm">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(prod.price)}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      Đã bán {prod.sold || 0}
                    </span>
                  </div>
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
