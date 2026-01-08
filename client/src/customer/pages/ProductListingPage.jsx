import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/common/ProductCard";
import { useCart } from "../../contexts/CartContext";
import { productService } from "../services/productService";

// Helper format giá
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const ProductListingPage = () => {
  const { category: categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const { addToCart } = useCart();

  // State dữ liệu
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State bộ lọc giao diện
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // 1. LẤY DANH MỤC
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        let data = [];
        if (response && Array.isArray(response.data)) data = response.data;
        else if (Array.isArray(response)) data = response;
        else if (response?.categories) data = response.categories;
        setCategories(data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. LẤY SẢN PHẨM
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        if (searchQuery) {
          response = await productService.searchProducts(searchQuery);
        } else if (categorySlug) {
          response = await productService.getProductsByCategory(categorySlug);
        } else {
          response = await productService.getProducts();
        }

        let data = [];
        if (response && Array.isArray(response.data)) data = response.data;
        else if (Array.isArray(response)) data = response;
        else if (response?.products) data = response.products;

        setProducts(data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, searchQuery]);

  // --- SỬA LỖI QUAN TRỌNG: Tách tên thương hiệu từ Object ---
  const brands = useMemo(() => {
    const brandSet = new Set();
    products.forEach((p) => {
      if (p.brand) {
        // Nếu brand là object (VD: {name: 'Nike'}), lấy .name. Nếu là string, lấy trực tiếp.
        const brandName = typeof p.brand === "object" ? p.brand.name : p.brand;
        if (brandName) brandSet.add(brandName);
      }
    });
    return Array.from(brandSet);
  }, [products]);

  // 3. LOGIC LỌC
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Lọc theo giá
    result = result.filter(
      (p) => (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1]
    );

    // Lọc theo thương hiệu (So sánh String vs String)
    if (selectedBrands.length > 0) {
      result = result.filter((p) => {
        const pBrandName = typeof p.brand === "object" ? p.brand.name : p.brand;
        return selectedBrands.includes(pBrandName);
      });
    }

    // Sắp xếp
    result.sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return (a.price || 0) - (b.price || 0);
        case "price_desc":
          return (b.price || 0) - (a.price || 0);
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name_desc":
          return (b.name || "").localeCompare(a.name || "");
        case "rating_desc":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [products, priceRange, selectedBrands, sortBy]);

  const handleBrandToggle = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 50000000]);
    setSelectedBrands([]);
    setSortBy("newest");
  };

  const currentCategory = categories.find((cat) => cat.slug === categorySlug);

  if (loading) {
    return (
      <div className="py-12 container mx-auto px-4 text-center">
        <div className="animate-pulse">Đang tải sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {searchQuery
              ? `Kết quả tìm kiếm: "${searchQuery}"`
              : currentCategory?.name || "Tất cả sản phẩm"}
          </h1>
          <p className="text-gray-600 mt-2">
            Tìm thấy {filteredProducts.length} sản phẩm
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá thấp đến cao</option>
            <option value="price_desc">Giá cao đến thấp</option>
            <option value="name_asc">Tên A-Z</option>
          </select>

          <button
            className="md:hidden border rounded-lg p-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            ⚙️ Lọc
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-64 flex-shrink-0 space-y-6`}
        >
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Bộ lọc</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:underline"
              >
                Xóa lọc
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2 text-sm text-gray-700">
                Khoảng giá
              </h4>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border rounded px-2 py-1 text-sm"
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="MAX"
                  className="w-full border rounded px-2 py-1 text-sm"
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium mb-2 text-sm text-gray-700">
                Danh mục
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/products"
                    className={`text-sm ${
                      categorySlug ? "text-gray-600" : "text-blue-600 font-bold"
                    }`}
                  >
                    Tất cả
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id || cat.id}>
                    <Link
                      to={`/products/${cat.slug}`}
                      className={`text-sm hover:text-blue-600 ${
                        categorySlug === cat.slug
                          ? "text-blue-600 font-bold"
                          : "text-gray-600"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands (SỬA LỖI CHÍNH TẠI ĐÂY) */}
            {brands.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-sm text-gray-700">
                  Thương hiệu
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brandName) => (
                    <label
                      key={brandName} // Key bây giờ chắc chắn là String
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brandName)}
                        onChange={() => handleBrandToggle(brandName)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{brandName}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="text-lg font-medium text-gray-900">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-500">
                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
