import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { useCart } from "../../contexts/CartContext";
import { productAPI as productService } from "../services/api";

const ProductListingPage = () => {
  const { category: categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const { addToCart } = useCart();
  const formatCurrencyInput = (value) => {
    if (!value) return "";
    // Xóa hết ký tự không phải số trước khi format
    const rawValue = value.toString().replace(/\D/g, "");
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Hàm biến chuỗi có dấu chấm thành số để lưu State: "1.000.000" -> 1000000
  const parseCurrencyInput = (value) => {
    if (!value) return 0;
    return Number(value.toString().replace(/\./g, ""));
  };
  // State dữ liệu
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE BỘ LỌC (Gửi lên Server) ---
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 100000000]);

  // --- STATE TẠM (Để nhập liệu không bị lag) ---
  const [tempPriceRange, setTempPriceRange] = useState([0, 100000000]);

  const [showFilters, setShowFilters] = useState(false);

  // 1. LẤY DANH MỤC
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        let data = Array.isArray(response) ? response : response.data || [];
        setCategories(data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. LẤY SẢN PHẨM (Server-side Filtering)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {
          page: 1,
          limit: 12,
          sort: sortBy,
          // 🔥 QUAN TRỌNG: Dùng priceRange (đã chốt) để gọi API, KHÔNG dùng tempPriceRange
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        };

        let response;
        if (searchQuery) {
          response = await productService.search(searchQuery, params);
        } else if (categorySlug && categorySlug !== "undefined") {
          response = await productService.getByCategory(categorySlug, params);
        } else {
          response = await productService.getAll(params);
        }

        let data = [];
        if (response && Array.isArray(response.data)) data = response.data;
        else if (Array.isArray(response)) data = response;

        setProducts(data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, searchQuery, sortBy, priceRange]); // Dependency là priceRange

  // --- Handlers ---

  // Xử lý khi gõ phím (Chỉ cập nhật số trên ô input, chưa gọi API)
  const handlePriceInputChange = (index, value) => {
    const newRange = [...tempPriceRange];

    newRange[index] = parseCurrencyInput(value);
    setTempPriceRange(newRange);
  };

  // Xử lý khi gõ xong (Enter hoặc click ra ngoài) -> Mới gọi API
  const applyPriceFilter = () => {
    // Chỉ cập nhật nếu giá trị thực sự thay đổi để tránh gọi API thừa
    if (
      tempPriceRange[0] !== priceRange[0] ||
      tempPriceRange[1] !== priceRange[1]
    ) {
      setPriceRange(tempPriceRange);
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 100000000]);
    setTempPriceRange([0, 100000000]); // Reset cả số trên ô input
    setSortBy("newest");
  };

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
            Hiển thị {products.length} sản phẩm
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
            <option value="sold_desc">Bán chạy nhất</option>
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

            {/* 🔥 SỬA LỖI NHẬP GIÁ Ở ĐÂY */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3 text-sm text-gray-900 uppercase tracking-wide">
                Khoảng giá (VNĐ)
              </h4>
              <div className="flex items-center gap-2 mb-2">
                {/* Ô MIN */}
                <input
                  type="text" // ⚠️ Đổi thành text để hiện dấu chấm
                  value={formatCurrencyInput(tempPriceRange[0])} // ⚠️ Format khi hiển thị
                  onChange={(e) => handlePriceInputChange(0, e.target.value)}
                  onBlur={applyPriceFilter}
                  onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="0"
                />

                <span className="text-gray-400">-</span>

                {/* Ô MAX */}
                <input
                  type="text" // ⚠️ Đổi thành text
                  value={formatCurrencyInput(tempPriceRange[1])} // ⚠️ Format khi hiển thị
                  onChange={(e) => handlePriceInputChange(1, e.target.value)}
                  onBlur={applyPriceFilter}
                  onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="100.000.000"
                />
              </div>
              <p className="text-xs text-gray-400 italic">
                Nhập giá (VD: 500.000) và nhấn Enter
              </p>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
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
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  isFlashSale={product.isFlashSale}
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
