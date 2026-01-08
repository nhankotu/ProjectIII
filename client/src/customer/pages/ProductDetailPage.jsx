import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { productService } from "../services/productService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductReviews from "../components/product/ProductReviews";
import RelatedProducts from "../components/product/RelatedProducts";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        setProduct(data);

        // Set default variant
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      ...product,
      quantity: selectedQuantity,
      variant: selectedVariant,
    };

    addToCart(cartItem, selectedQuantity);

    // Show success message (you can add toast notification here)
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

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorMessage message={error} />
        <button
          onClick={() => navigate("/products")}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Product not found
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <ol className="flex flex-wrap items-center space-x-2">
          <li>
            <button
              onClick={() => navigate("/")}
              className="hover:text-blue-600"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() =>
                navigate(`/category/${product.category?.slug || "all"}`)
              }
              className="hover:text-blue-600"
            >
              {product.category?.name || "Products"}
            </button>
          </li>
          <li>/</li>
          <li className="font-medium text-gray-900 truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Images */}
        <div>
          <ProductGallery images={product.images || [product.image]} />
        </div>

        {/* Right Column - Info & Actions */}
        <div>
          <ProductInfo
            product={product}
            selectedQuantity={selectedQuantity}
            selectedVariant={selectedVariant}
            onQuantityChange={handleQuantityChange}
            onVariantSelect={setSelectedVariant}
          />

          {/* Action Buttons */}
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
                  {isInCart(product.id) ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Added to Cart
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
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

          {/* Additional Actions */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>Add to Wishlist</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {["description", "specifications", "reviews", "shipping"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold mb-4">Product Description</h3>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />

              {product.features && (
                <div className="mt-8">
                  <h4 className="text-xl font-semibold mb-4">Key Features</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {product.specifications?.map((spec, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {spec.key}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {spec.value}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No specifications available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && <ProductReviews productId={product.id} />}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold mb-3">
                  Shipping Information
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    Free shipping on orders over $50. Standard delivery: 3-5
                    business days.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3">Return Policy</h4>
                <p className="text-gray-700">
                  30-day return policy. Items must be unused and in original
                  packaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        productId={product.id}
        categoryId={product.category?.id}
      />
    </div>
  );
};

export default ProductDetailPage;
