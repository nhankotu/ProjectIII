import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { productAPI as productService } from "../services/api";

// Components
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import RelatedProducts from "../components/product/RelatedProducts";
import ShopInfoSection from "../components/product/ShopInfoSection";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý số lượng và biến thể
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getById(id);
        // Đảm bảo lấy đúng data từ axios response
        const productData = response.data?.data || response.data || response;
        setProduct(productData);

        if (productData.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (err) {
        setError(err.message || "Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Helper lấy Seller ID an toàn (hỗ trợ cả dạng object populate và string ID)
  const getSellerId = () => {
    if (!product?.sellerId) return null;
    return typeof product.sellerId === "object"
      ? product.sellerId._id
      : product.sellerId;
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      ...product,
      quantity: selectedQuantity,
      variant: selectedVariant,
    };
    addToCart(cartItem, selectedQuantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleQuantityChange = (change) => {
    const newQuantity = selectedQuantity + change;
    // Lấy stock từ variant nếu có, không thì lấy từ stock chính của sản phẩm
    const currentStock = selectedVariant
      ? selectedVariant.stock
      : product?.stock || 0;

    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setSelectedQuantity(newQuantity);
    }
  };

  if (loading)
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="py-20">
        <ErrorMessage message={error} />
      </div>
    );
  if (!product)
    return (
      <div className="py-20 text-center text-gray-500 font-medium">
        Sản phẩm không tồn tại
      </div>
    );

  return (
    <div className="py-8 container mx-auto px-4 bg-gray-50 min-h-screen">
      {/* 1. SECTION CHÍNH: MEDIA & THÔNG TIN CƠ BẢN */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Cột trái: Hình ảnh & Video */}
          <div>
            <ProductGallery
              images={
                product.images?.length > 0
                  ? product.images
                  : [{ url: product.thumbnail }]
              }
              video={product.video}
            />
          </div>

          {/* Cột phải: Thông tin giá, nút mua, rating */}
          <div>
            <ProductInfo
              product={product}
              selectedQuantity={selectedQuantity}
              selectedVariant={selectedVariant}
              onQuantityChange={handleQuantityChange}
              onVariantSelect={setSelectedVariant}
            />

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {product.stock > 0 ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={isInCart(product._id)}
                    className={`flex-1 py-4 px-6 rounded-lg font-bold transition-all ${
                      isInCart(product._id)
                        ? "bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-200"
                    }`}
                  >
                    {isInCart(product._id)
                      ? "✓ Đã trong giỏ hàng"
                      : "Thêm vào giỏ"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-bold hover:opacity-90 active:scale-95 shadow-lg shadow-orange-200 transition-all"
                  >
                    Mua ngay
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full py-4 px-6 bg-gray-200 text-gray-500 rounded-lg font-bold cursor-not-allowed"
                >
                  Hết hàng tạm thời
                </button>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Giao hàng miễn phí
                </p>
                <p className="text-xs text-blue-700 font-medium">
                  Cho đơn hàng trên 500.000 VNĐ. Nhận hàng trong 2-4 ngày.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION SHOP INFO */}
      <ShopInfoSection
        sellerId={getSellerId()}
        currentProductId={product._id}
      />

      {/* 3. CHI TIẾT SẢN PHẨM & THÔNG SỐ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Cột rộng: Mô tả */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Mô tả sản phẩm
          </h3>
          <div
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Cột hẹp: Thông số kỹ thuật (Attributes) */}
        <div className="bg-white rounded-xl shadow-sm border p-6 h-fit">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
            Thông số kỹ thuật
          </h3>
          {product.attributes && Object.keys(product.attributes).length > 0 ? (
            <div className="space-y-0 border-t border-l border-r rounded-lg overflow-hidden">
              {Object.entries(product.attributes).map(([key, value], index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="p-3 text-sm font-semibold text-gray-600 border-r">
                    {key}
                  </div>
                  <div className="p-3 text-sm text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic text-center">
              Đang cập nhật thông số...
            </p>
          )}
        </div>
      </div>

      {/* 4. SẢN PHẨM LIÊN QUAN */}
      <RelatedProducts
        productId={product._id}
        categoryId={product.category?._id || product.category}
      />
    </div>
  );
};

export default ProductDetailPage;
