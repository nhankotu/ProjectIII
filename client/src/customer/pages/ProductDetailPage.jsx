import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { productService } from "../services/productService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import RelatedProducts from "../components/product/RelatedProducts";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        // Logic bóc tách data đã fix ở bước trước
        const productData = response.data || response;
        setProduct(productData);

        if (productData.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      ...product,
      quantity: selectedQuantity,
      variant: selectedVariant,
    };
    addToCart(cartItem, selectedQuantity);
    alert(`${selectedQuantity} ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleQuantityChange = (change) => {
    const newQuantity = selectedQuantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setSelectedQuantity(newQuantity);
    }
  };

  if (loading)
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="py-12">
        <ErrorMessage message={error} />
      </div>
    );
  if (!product)
    return <div className="py-12 text-center">Product not found</div>;

  return (
    <div className="py-8 container mx-auto px-4">
      {/* 1. Phần chính: Ảnh & Thông tin mua hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left: Gallery */}
        <div>
          <ProductGallery images={product.images || [product.image]} />
        </div>

        {/* Right: Info & Actions */}
        <div>
          <ProductInfo
            product={product}
            selectedQuantity={selectedQuantity}
            selectedVariant={selectedVariant}
            onQuantityChange={handleQuantityChange}
            onVariantSelect={setSelectedVariant}
          />

          {/* Action Buttons: Giữ lại cái quan trọng nhất */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {product.stock > 0 ? (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart(product.id)}
                  className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-colors ${
                    isInCart(product.id)
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:opacity-90"
                >
                  Buy Now
                </button>
              </>
            ) : (
              <button
                disabled
                className="w-full py-4 px-6 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>

          {/* Thông tin shipping ngắn gọn (Thay cho Tab Shipping) */}
          <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded">
            🚚 Free shipping on orders over $50. Standard delivery: 3-5 days.
          </div>
        </div>
      </div>

      {/* 2. Phần mô tả chi tiết (Bỏ Tabs, hiển thị luôn) */}
      <div className="mb-12 border-t pt-8">
        <h3 className="text-2xl font-bold mb-6">Product Description</h3>
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        {/* Nếu có Features thì hiển thị luôn dưới mô tả */}
        {product.features && (
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4">Key Features</h4>
            <ul className="list-disc list-inside space-y-2">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. Sản phẩm liên quan */}
      <RelatedProducts
        productId={product.id}
        categoryId={product.category?.id}
      />
    </div>
  );
};

export default ProductDetailPage;
