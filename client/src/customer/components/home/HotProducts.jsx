import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { useHotProducts } from "../csshook/useHotProducts";
import { formatPrice } from "@/lib/formatters";

const HotProducts = () => {
  const { products, loading, error } = useHotProducts();

  if (loading) return null;
  if (error || products.length === 0) return null;

  return (
    <section className="container mx-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Flame className="text-red-500" />
        <h2 className="text-xl font-bold">Sản phẩm bán chạy</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const image =
            product.thumbnail?.url ||
            product.images?.[0]?.url ||
            "/images/placeholder.jpg";

          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border rounded-lg p-3 hover:shadow-md transition"
            >
              <img
                src={image}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-2"
              />

              <h3 className="text-sm font-medium line-clamp-2 mb-1">
                {product.name}
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-red-600 font-semibold">
                  {formatPrice(product.price)}
                </span>

                {product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Đã bán {product.sold}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default HotProducts;
