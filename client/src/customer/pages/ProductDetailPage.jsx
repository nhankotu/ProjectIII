import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { productAPI as productService, chatAPI } from "../services/api";
import { useAuth } from "../../contexts/AuthContext";

// Components
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import ProductGallery from "../components/product/ProductGallery";
import RelatedProducts from "../components/product/RelatedProducts";
import ShopInfoSection from "../components/product/ShopInfoSection";
// 🔥 THÊM DÒNG NÀY
import ProductReviews from "../components/product/ProductReviews";

import {
  Star,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  MessageCircle,
  Clock,
  Zap,
} from "lucide-react";

// --- Sub-Component: Countdown Timer ---
const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endTime).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        h: Math.floor(distance / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const formatNum = (num) => String(num).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 font-mono">
      <span className="bg-black text-white px-1.5 py-0.5 rounded text-xs">
        {formatNum(timeLeft.h)}
      </span>
      :
      <span className="bg-black text-white px-1.5 py-0.5 rounded text-xs">
        {formatNum(timeLeft.m)}
      </span>
      :
      <span className="bg-black text-white px-1.5 py-0.5 rounded text-xs">
        {formatNum(timeLeft.s)}
      </span>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);

  // State quản lý lựa chọn
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getById(id);
        const data = response.data?.data || response.data || response;
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.type === "variable" && product.variants) {
      const foundVariant = product.variants.find((v) => {
        return Object.entries(selectedOptions).every(
          ([key, value]) => v.options[key] === value,
        );
      });
      setSelectedVariant(foundVariant || null);
    }
  }, [selectedOptions, product]);

  // --- LOGIC TÍNH GIÁ HIỂN THỊ ---
  const hasFlashSale = product?.isFlashSale && product?.salePrice;

  const currentPrice = hasFlashSale
    ? product.salePrice
    : selectedVariant
      ? selectedVariant.price
      : product?.price;

  const originalPriceDisplay = hasFlashSale
    ? selectedVariant
      ? selectedVariant.price
      : product?.price
    : product?.originalPrice || null;

  const displayStock = selectedVariant ? selectedVariant.stock : product?.stock;

  const handleOptionSelect = (attributeName, value) => {
    setSelectedOptions((prev) => ({ ...prev, [attributeName]: value }));
  };

  const handleQuantityChange = (change) => {
    const newQuantity = selectedQuantity + change;
    if (newQuantity >= 1 && newQuantity <= displayStock) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleAddToCart = async (isBuyNow = false) => {
    if (!product) return;
    await addToCart({
      product: product,
      quantity: selectedQuantity,
      variant: selectedVariant,
      price: currentPrice,
    });
    if (isBuyNow) navigate("/cart");
  };

  const handleChatNow = async () => {
    if (!user) return navigate("/login", { state: { from: `/product/${id}` } });
    const sellerId = product.sellerId?._id || product.sellerId;
    if (user._id === sellerId) return alert("Bạn là chủ shop!");

    try {
      setLoadingChat(true);
      const res = await chatAPI.createOrGetConversation(sellerId);
      if (res.data) {
        window.dispatchEvent(
          new CustomEvent("OPEN_CHAT_WIDGET", {
            detail: { conversation: res.data, product: product },
          }),
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingChat(false);
    }
  };

  if (loading)
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  if (error || !product)
    return (
      <div className="py-20 text-center">
        <ErrorMessage message={error || "Lỗi 404"} />
      </div>
    );

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);

  return (
    <div className="py-8 bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4">
        {/* MAIN SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-10 mb-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT: GALLERY */}
            <ProductGallery images={product.images || []} />

            {/* RIGHT: INFO */}
            <div className="flex flex-col">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-6 text-sm">
                <div className="flex items-center text-yellow-400 font-bold">
                  <span>{product.ratingAverage || 5}</span>{" "}
                  <Star size={14} fill="currentColor" className="ml-1" />
                </div>
                <div className="h-3 w-px bg-gray-300"></div>
                <span className="text-gray-500">
                  {product.sold || 0} Đã bán
                </span>
              </div>

              {/* 🔥 FLASH SALE PRICE BOX */}
              {hasFlashSale ? (
                <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5 mb-6 text-white shadow-lg shadow-red-100">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 font-black italic uppercase tracking-tighter text-lg">
                      <Zap size={24} fill="currentColor" /> Flash Sale
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full border border-white/30">
                      <span className="text-[10px] font-bold uppercase whitespace-nowrap">
                        Kết thúc sau
                      </span>
                      <CountdownTimer
                        endTime={product.flashSaleInfo?.endTime}
                      />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-black">
                      {formatPrice(currentPrice)}
                    </span>
                    <span className="text-lg opacity-70 line-through font-medium">
                      {formatPrice(originalPriceDisplay)}
                    </span>
                    <div className="bg-white text-red-600 px-2 py-0.5 rounded-lg text-xs font-bold shadow-sm">
                      -
                      {Math.round(
                        ((originalPriceDisplay - currentPrice) /
                          originalPriceDisplay) *
                          100,
                      )}
                      %
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-5 rounded-2xl mb-6 flex items-baseline gap-4">
                  <span className="text-4xl font-extrabold text-blue-600">
                    {formatPrice(currentPrice)}
                  </span>
                  {originalPriceDisplay > currentPrice && (
                    <span className="text-gray-400 line-through text-lg">
                      {formatPrice(originalPriceDisplay)}
                    </span>
                  )}
                </div>
              )}

              {/* VARIANT SELECTION (Giữ nguyên gốc của bạn) */}
              {product.type === "variable" &&
                product.variantAttributes?.map((attr) => (
                  <div key={attr.name} className="mb-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                      {attr.name}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {attr.values.map((val) => {
                        const isSelected = selectedOptions[attr.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionSelect(attr.name, val)}
                            className={`px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md shadow-blue-100"
                                : "border-gray-100 text-gray-600 hover:border-blue-200 bg-white"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* QUANTITY (Giữ nguyên gốc của bạn) */}
              <div className="mb-8 flex items-center gap-6">
                <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1 bg-white">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-50 text-gray-400"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-10 text-center font-bold text-lg">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-50 text-gray-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-sm font-medium text-gray-400">
                  {displayStock} sản phẩm có sẵn
                </span>
              </div>

              {/* ACTION BUTTONS (Giữ nguyên gốc của bạn) */}
              <div className="flex gap-4 mt-auto">
                <button
                  onClick={handleChatNow}
                  disabled={loadingChat}
                  className="p-4 border-2 border-green-500 text-green-600 rounded-2xl hover:bg-green-50 transition-all shadow-sm"
                >
                  <MessageCircle size={24} />
                </button>
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={displayStock === 0}
                  className="flex-1 flex items-center justify-center gap-3 py-4 border-2 border-blue-600 text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-tight"
                >
                  <ShoppingCart size={22} /> Thêm vào giỏ
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={displayStock === 0}
                  className="flex-[1.5] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-tight"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SHOP INFO */}
        <ShopInfoSection sellerId={product.sellerId?._id || product.sellerId} />

        {/* DETAILS & SPECS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div> Mô tả sản
              phẩm
            </h3>
            <div
              className="prose max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-fit">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-orange-500 rounded-full"></div> Thông
              số kỹ thuật
            </h3>
            <div className="space-y-3">
              {product.specifications?.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-2 border-b border-gray-50 text-sm"
                >
                  <span className="font-bold text-gray-400 uppercase text-[11px]">
                    {spec.name}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔥 PHẦN ĐÁNH GIÁ (MỚI THÊM) */}
        <div className="mb-12">
          <ProductReviews productId={product._id} />
        </div>

        <RelatedProducts
          productId={product._id}
          categoryId={product.category?._id || product.category}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
