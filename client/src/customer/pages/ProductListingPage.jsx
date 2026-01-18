import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { useCart } from "../../contexts/CartContext";
// Import Alias: productService đại diện cho productAPI
import { productAPI as productService } from "../services/api";

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

  // 1. LẤY DANH SÁCH DANH MỤC (Cho Sidebar)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 🔥 SỬA: Dùng hàm getCategories để lấy list, không dùng getByCategory (lấy sản phẩm)
        const response = await productService.getCategories();

        // Xử lý data an toàn
        let data = [];
        if (response && Array.isArray(response.data)) data = response.data;
        else if (Array.isArray(response)) data = response;

        setCategories(data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. LẤY SẢN PHẨM (Logic quan trọng nhất)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        // 👇 CHỐT CHẶN: Kiểm tra kỹ biến categorySlug
        const hasCategory =
          categorySlug &&
          categorySlug !== "undefined" &&
          categorySlug !== "null";

        if (searchQuery) {
          // Case 1: Tìm kiếm
          response = await productService.search(searchQuery);
        } else if (hasCategory) {
          // Case 2: Có danh mục hợp lệ -> Gọi API theo danh mục
          // console.log("Lấy theo danh mục:", categorySlug);
          response = await productService.getByCategory(categorySlug);
        } else {
          // Case 3: Không có gì -> Lấy tất cả
          // console.log("Lấy tất cả sản phẩm");
          response = await productService.getAll();
        }

        // Xử lý data trả về (Hỗ trợ cả dạng {data: []} và dạng [])
        let data = [];
        if (response && Array.isArray(response.data)) data = response.data;
        else if (Array.isArray(response)) data = response;
        else if (response?.products) data = response.products;

        setProducts(data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setProducts([]); // Set rỗng để không crash
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, searchQuery]);

  // --- Tách thương hiệu từ sản phẩm ---
  const brands = useMemo(() => {
    const brandSet = new Set();
    products.forEach((p) => {
      if (p.brand) {
        const brandName = typeof p.brand === "object" ? p.brand.name : p.brand;
        if (brandName) brandSet.add(brandName);
      }
    });
    return Array.from(brandSet);
  }, [products]);

  // 3. LOGIC LỌC & SẮP XẾP (Client-side)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Lọc giá
    result = result.filter(
      (p) => (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1]
    );

    // Lọc thương hiệu
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
        default: // newest
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return result;
  }, [products, priceRange, selectedBrands, sortBy]);

  // --- Handlers ---
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

  // Tìm tên danh mục hiện tại để hiển thị Title
  const currentCategory = categories.find((cat) => cat.slug === categorySlug);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
            {searchQuery
              ? `Kết quả tìm kiếm: "${searchQuery}"`
              : currentCategory?.name || "Tất cả sản phẩm"}
          </h1>
          <p className="text-gray-500 mt-1">
            Hiển thị {filteredProducts.length} sản phẩm
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="name_asc">Tên: A-Z</option>
          </select>

          <button
            className="md:hidden border p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
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
          } md:block w-full md:w-64 flex-shrink-0`}
        >
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-800">Bộ lọc</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 font-medium hover:underline"
              >
                XÓA TẤT CẢ
              </button>
            </div>

            {/* Danh mục */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3 text-sm text-gray-900 uppercase tracking-wide">
                Danh mục
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/products"
                    className={`block px-2 py-1.5 rounded-md text-sm transition-colors ${
                      !categorySlug
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    Tất cả sản phẩm
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id || cat.id}>
                    <Link
                      to={`/products/${cat.slug}`}
                      className={`block px-2 py-1.5 rounded-md text-sm transition-colors ${
                        categorySlug === cat.slug
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Khoảng giá */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3 text-sm text-gray-900 uppercase tracking-wide">
                Khoảng giá
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Thương hiệu */}
            {brands.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-sm text-gray-900 uppercase tracking-wide">
                  Thương hiệu
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {brands.map((brandName) => (
                    <label
                      key={brandName}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brandName)}
                        onChange={() => handleBrandToggle(brandName)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                        {brandName}
                      </span>
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
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-500 mb-6">
                Thử thay đổi bộ lọc hoặc tìm từ khóa khác nhé.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={addToCart} // Truyền hàm giỏ hàng xuống
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
