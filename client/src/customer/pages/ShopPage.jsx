import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin, Search, Filter, ArrowUpDown } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { productAPI as productService, shopAPI } from "../services/api";

const ShopPage = () => {
  const { id } = useParams();

  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [sortBy, setSortBy] = useState("newest");

  // 1. FETCH DỮ LIỆU BAN ĐẦU (Shop Info + Products Song Song)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Gọi 2 API cùng lúc để đảm bảo có dữ liệu nhanh nhất
        const [shopRes, productRes] = await Promise.all([
          shopAPI.getPublicInfo(id),
          productService.getAll({
            seller: id,
            limit: 12,
            sort: "newest",
          }),
        ]);

        // Xử lý thông tin Shop
        if (shopRes.data && shopRes.data.success) {
          setShopData(shopRes.data.data);
        } else {
          setShopData(shopRes.data || shopRes);
        }

        // Xử lý danh sách sản phẩm
        const productList = productRes.data?.data || productRes.data || [];
        setProducts(productList);
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
    try {
      const res = await productService.getAll({
        seller: id,
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
  }, [activeTab, id, sortBy]);

  // 3. Xử lý Filter
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

  if (!shopData)
    return (
      <div className="py-20 text-center text-xl">
        Shop không tồn tại hoặc đã bị khóa.
      </div>
    );

  const shop = shopData.shop || shopData;
  const totalProducts = shopData.totalProducts || products.length || 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* --- PHẦN 1: SHOP HEADER --- */}
      <div className="bg-white shadow-sm mb-4">
        {/* Banner */}
        <div
          className="h-32 md:h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${
              shop.basicInfo?.banner || "https://via.placeholder.com/1200x300"
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Info Container */}
        <div className="container mx-auto px-4 -mt-16 relative z-10 pb-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Logo & Name */}
            <div className="flex flex-col items-center">
              <img
                src={shop.basicInfo?.logo || "https://via.placeholder.com/150"}
                alt="Shop Logo"
                className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover bg-gray-200"
              />
              <h1 className="text-2xl font-bold mt-2 text-center mb-2">
                {shop.basicInfo?.shopName || "Tên Shop"}
              </h1>
              {/* Đã xóa các nút Chat/Follow ở đây */}
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full pt-4 md:pt-2 border-t md:border-t-0 mt-4 md:mt-0">
              <div className="text-center md:text-left md:border-r">
                <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center md:justify-start">
                  <Star size={16} /> Đánh giá
                </div>
                <div className="text-xl font-bold text-orange-500">
                  {shop.avgRating ? Number(shop.avgRating).toFixed(1) : "5.0"} /
                  5.0
                </div>
              </div>
              <div className="text-center md:text-left md:border-r">
                <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center md:justify-start">
                  <Search size={16} /> Sản phẩm
                </div>
                <div className="text-xl font-bold text-indigo-600">
                  {totalProducts}
                </div>
              </div>
              <div className="text-center md:text-left md:border-r">
                <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center md:justify-start">
                  <Search size={16} /> Tham gia
                </div>
                <div className="text-lg font-semibold">
                  {shop.createdAt
                    ? new Date(shop.createdAt).getFullYear()
                    : "2024"}
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center md:justify-start">
                  <MapPin size={16} /> Khu vực
                </div>
                <div className="text-lg font-semibold truncate">
                  {shop.basicInfo?.address || "Toàn quốc"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="container mx-auto px-4">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === "home"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-indigo-600"
              }`}
            >
              Dạo Shop
            </button>
            <button
              onClick={() => setActiveTab("all_products")}
              className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === "all_products"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-indigo-600"
              }`}
            >
              Tất cả sản phẩm
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === "profile"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-indigo-600"
              }`}
            >
              Hồ sơ Shop
            </button>
          </div>
        </div>
      </div>

      {/* --- PHẦN 3: CONTENT --- */}
      <div className="container mx-auto px-4 mt-6">
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <div>
            <h3 className="text-xl font-bold mb-4 uppercase text-gray-800">
              Sản phẩm nổi bật
            </h3>
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                Shop chưa có sản phẩm nào.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border rounded-lg p-2 shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={
                        product.thumbnail?.url ||
                        product.thumbnail ||
                        "https://via.placeholder.com/150"
                      }
                      className="w-full h-40 object-cover rounded mb-2"
                      alt={product.name}
                    />
                    <p className="line-clamp-2 font-medium text-sm h-10 mb-1">
                      {product.name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-red-600 font-bold">
                        {product.price?.toLocaleString()}đ
                      </span>
                      <span className="text-xs text-gray-400">
                        Đã bán {product.sold || 0}
                      </span>
                    </div>
                    <a
                      href={`/product/${product._id}`}
                      className="block text-center mt-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded hover:bg-indigo-100 transition"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL PRODUCTS */}
        {activeTab === "all_products" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h3 className="text-xl font-bold uppercase text-gray-800">
                Tất cả sản phẩm
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSortChange("newest")}
                  className={`flex items-center gap-1 px-3 py-1 border rounded text-sm transition ${
                    sortBy === "newest"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <Filter size={14} /> Mới nhất
                </button>
                <button
                  onClick={() => handleSortChange("sold_desc")}
                  className={`flex items-center gap-1 px-3 py-1 border rounded text-sm transition ${
                    sortBy === "sold_desc"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <Filter size={14} /> Bán chạy
                </button>
                <button
                  onClick={() => handleSortChange("price_asc")}
                  className={`flex items-center gap-1 px-3 py-1 border rounded text-sm transition ${
                    sortBy === "price_asc"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <ArrowUpDown size={14} /> Giá thấp
                </button>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg border">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border rounded-lg p-2 shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={
                        product.thumbnail?.url ||
                        product.thumbnail ||
                        "https://via.placeholder.com/150"
                      }
                      className="w-full h-40 object-cover rounded mb-2"
                      alt={product.name}
                    />
                    <p className="line-clamp-2 font-medium text-sm h-10 mb-1">
                      {product.name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-red-600 font-bold">
                        {product.price?.toLocaleString()}đ
                      </span>
                      <span className="text-xs text-gray-400">
                        Đã bán {product.sold || 0}
                      </span>
                    </div>
                    <a
                      href={`/product/${product._id}`}
                      className="block text-center mt-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded hover:bg-indigo-100 transition"
                    >
                      Mua ngay
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">
                Giới thiệu Shop
              </h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {shop.basicInfo?.description || "Shop chưa cập nhật mô tả."}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm h-fit border">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">
                Chính sách & Thông tin
              </h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex justify-between border-b border-dashed pb-2">
                  <span>Thời gian xử lý:</span>{" "}
                  <span className="font-medium text-black">
                    {shop.policies?.processingTime || "Trong ngày"}
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
