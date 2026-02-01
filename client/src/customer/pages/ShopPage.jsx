import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Search, Filter, ArrowUpDown } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { productAPI as productService, shopAPI } from "../services/api";

// --- CÁC LINK ẢNH MẶC ĐỊNH ---
const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&h=400&fit=crop";
const DEFAULT_LOGO =
  "https://images.unsplash.com/photo-1472851294608-41531b665086?q=80&w=200&h=200&fit=crop";
const DEFAULT_PRODUCT_IMG =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&h=300&fit=crop";

const ShopPage = () => {
  const { id } = useParams(); // Đây là Shop ID (696d209e...)

  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [sortBy, setSortBy] = useState("newest");

  // 1. FETCH DỮ LIỆU BAN ĐẦU
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // API này đã trả về cả thông tin Shop lẫn danh sách Products ban đầu
        const shopRes = await shopAPI.getPublicInfo(id);

        const data = shopRes.data || shopRes;

        if (data && data.shop) {
          setShopData(data); // Lưu toàn bộ data (shop + products + stats)
          setProducts(data.products || []); // Set products ban đầu từ API shop luôn
        }
      } catch (error) {
        console.error("Lỗi tải trang shop:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInitialData();
  }, [id]);

  // 2. LẤY SẢN PHẨM KHI CHUYỂN TAB HOẶC LỌC
  const fetchAllShopProducts = async () => {
    // Nếu chưa có dữ liệu shop thì không gọi được (vì cần Owner ID)
    const ownerId = shopData?.shop?.ownerInfo?._id || shopData?.shop?.owner;
    if (!ownerId) return;

    try {
      const res = await productService.getAll({
        seller: ownerId, // 🔥 SỬA QUAN TRỌNG: Dùng Owner ID để lọc sản phẩm, không dùng Shop ID
        limit: 20,
        sort: sortBy,
      });
      const data = res.data?.data || res.data || [];
      setProducts(data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm của shop:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "all_products") {
      fetchAllShopProducts();
    }
  }, [activeTab, sortBy, shopData]); // Thêm shopData vào dep để đảm bảo có ownerId

  const handleSortChange = (type) => {
    if (sortBy === type) return;
    setSortBy(type);
  };

  if (loading)
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  if (!shopData?.shop)
    return <div className="py-20 text-center text-xl">Shop không tồn tại.</div>;

  const { shop, totalProducts } = shopData;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* --- PHẦN 1: SHOP HEADER --- */}
      <div className="bg-white shadow-sm mb-4">
        {/* Banner */}
        <div
          className="h-32 md:h-60 bg-cover bg-center relative"
          style={{
            // 🔥 SỬA: Lấy trực tiếp shop.banner (bỏ basicInfo)
            backgroundImage: `url(${shop.banner || DEFAULT_BANNER})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Info Container */}
        <div className="container mx-auto px-4 -mt-16 relative z-10 pb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6 backdrop-blur-sm bg-white/95">
            {/* Logo & Name */}
            <div className="flex flex-col items-center -mt-12 md:-mt-16">
              <img
                // 🔥 SỬA: Lấy trực tiếp shop.logo
                src={shop.logo || DEFAULT_LOGO}
                alt="Shop Logo"
                className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover bg-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_LOGO;
                }}
              />
              <h1 className="text-2xl font-bold mt-3 text-center mb-1 text-gray-900">
                {/* 🔥 SỬA: Lấy trực tiếp shop.name */}
                {shop.name || "Tên Shop"}
              </h1>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                Đang hoạt động
              </span>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full pt-4 md:pt-2 border-t md:border-t-0 mt-4 md:mt-0">
              <div className="text-center md:text-left md:border-r border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center md:justify-start text-sm">
                  <Star size={16} className="text-orange-400" /> Đánh giá
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {/* 🔥 SỬA: Lấy avgRating trực tiếp */}
                  {shop.avgRating || "0.0"}{" "}
                  <span className="text-sm text-gray-400 font-normal">
                    / 5.0
                  </span>
                </div>
              </div>
              <div className="text-center md:text-left md:border-r border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center md:justify-start text-sm">
                  <Search size={16} className="text-blue-500" /> Sản phẩm
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {totalProducts}
                </div>
              </div>
              <div className="text-center md:text-left md:border-r border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center md:justify-start text-sm">
                  <ArrowUpDown size={16} className="text-green-500" /> Tham gia
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {/* 🔥 SỬA: Lấy joinedAt hoặc createdAt */}
                  {new Date(shop.joinedAt || shop.createdAt).getFullYear()}
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center md:justify-start text-sm">
                  <MapPin size={16} className="text-red-500" /> Khu vực
                </div>
                <div className="text-lg font-semibold text-gray-800 truncate max-w-[150px]">
                  {/* 🔥 SỬA: Lấy contact.address */}
                  {shop.contact?.address ? "Việt Nam" : "Toàn quốc"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="container mx-auto px-4 mt-2">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {["home", "all_products", "profile"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab === "home"
                  ? "Dạo Shop"
                  : tab === "all_products"
                  ? "Tất cả sản phẩm"
                  : "Hồ sơ Shop"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- PHẦN 3: CONTENT --- */}
      <div className="container mx-auto px-4 mt-6">
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <div>
            <h3 className="text-xl font-bold mb-4 uppercase text-gray-800 flex items-center gap-2">
              <Star className="text-yellow-400" fill="currentColor" /> Sản phẩm
              nổi bật
            </h3>
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-10 bg-white rounded-lg shadow-sm">
                Shop chưa có sản phẩm nào.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-lg transition duration-300 group"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={
                          product.thumbnail?.url ||
                          product.thumbnail ||
                          DEFAULT_PRODUCT_IMG
                        }
                        className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-500"
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_PRODUCT_IMG;
                        }}
                      />
                    </div>
                    <p className="line-clamp-2 font-medium text-sm h-10 mb-1 text-gray-700 group-hover:text-blue-600 transition">
                      {product.name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-red-600 font-bold">
                        {product.price?.toLocaleString()}đ
                      </span>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        Đã bán {product.sold || 0}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL PRODUCTS */}
        {activeTab === "all_products" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-xl font-bold uppercase text-gray-800">
                Tất cả sản phẩm
              </h3>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "newest", label: "Mới nhất" },
                  { key: "sold_desc", label: "Bán chạy" },
                  { key: "price_asc", label: "Giá thấp" },
                ].map((sortOption) => (
                  <button
                    key={sortOption.key}
                    onClick={() => handleSortChange(sortOption.key)}
                    className={`flex items-center gap-1 px-4 py-2 border rounded-full text-sm transition ${
                      sortBy === sortOption.key
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {sortOption.label}
                  </button>
                ))}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg border">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-lg transition duration-300 group"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={
                          product.thumbnail?.url ||
                          product.thumbnail ||
                          DEFAULT_PRODUCT_IMG
                        }
                        className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-500"
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_PRODUCT_IMG;
                        }}
                      />
                    </div>
                    <p className="line-clamp-2 font-medium text-sm h-10 mb-1 text-gray-700 group-hover:text-blue-600 transition">
                      {product.name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-red-600 font-bold">
                        {product.price?.toLocaleString()}đ
                      </span>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        Đã bán {product.sold || 0}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                <MapPin className="text-blue-500" size={20} /> Giới thiệu Shop
              </h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {/* 🔥 SỬA: Lấy trực tiếp shop.description */}
                {shop.description || "Chưa có mô tả giới thiệu về Shop."}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm h-fit border border-gray-100">
              <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                <Filter className="text-green-500" size={20} /> Chính sách
              </h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex justify-between border-b border-dashed pb-2">
                  <span>Thời gian xử lý:</span>{" "}
                  <span className="font-medium text-black">
                    {/* 🔥 SỬA: Lấy policies.supportTime */}
                    {shop.policies?.supportTime || "Trong ngày"}
                  </span>
                </li>
                <li className="flex justify-between border-b border-dashed pb-2">
                  <span>Đổi trả:</span>{" "}
                  <span className="font-medium text-black">
                    {shop.policies?.returnPolicy || "Theo quy định sàn"}
                  </span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Bảo hành:</span>{" "}
                  <span className="font-medium text-black">
                    {shop.policies?.warrantyPolicy || "Không bảo hành"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
