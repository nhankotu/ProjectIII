import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { productAPI as productService } from "../services/api";
import ProductCard from "../components/product/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import SearchBar from "../components/common/SearchBar";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy các tham số từ URL
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sort") || "relevance";
  const page = parseInt(searchParams.get("page") || "1");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // State filter local (để UI hiển thị)
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 10000000 },
    brands: [],
    inStock: false,
    onSale: false,
  });

  const [activeFilters, setActiveFilters] = useState({
    category: category || "",
    minPrice: minPrice || "",
    maxPrice: maxPrice || "",
    sort: sortBy,
  });

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Chuẩn bị params gửi xuống Backend
        const params = {
          keyword: query, // 🔥 Backend đã sửa để nhận 'keyword', 'q', hoặc 'search'
          category: activeFilters.category,
          minPrice: activeFilters.minPrice,
          maxPrice: activeFilters.maxPrice,
          sort: activeFilters.sort,
          page,
          limit: 12,
        };

        // 🔥 FIX 1: Gọi đúng hàm getAll với 1 tham số object params
        // (Trước đó bạn gọi getAll(query, params) là sai)
        const response = await productService.getAll(params);

        // 🔥 FIX 2: Đọc đúng cấu trúc JSON { success, data, pagination }
        setProducts(response.data || []);

        // Đọc thông tin phân trang từ object pagination
        setTotalResults(response.pagination?.totalProducts || 0);
        setTotalPages(response.pagination?.totalPages || 1);

        // (Optional) Nếu Backend trả về filters động thì set vào đây
        if (response.filters) {
          setFilters(response.filters);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch search results");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Luôn gọi fetch khi URL hoặc filter thay đổi
    fetchSearchResults();
  }, [query, category, activeFilters, page]);

  // Update URL when filters change
  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (newFilters.page > 1) params.set("page", newFilters.page);

    navigate(`/search?${params.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value, page: 1 };
    setActiveFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...activeFilters, page: newPage };
    setActiveFilters(newFilters);
    updateSearchParams(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    const newFilters = {
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "relevance",
      page: 1,
    };
    setActiveFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const sortOptions = [
    { value: "relevance", label: "Liên quan" },
    { value: "price_asc", label: "Giá: Thấp đến Cao" }, // Sửa value cho khớp Backend
    { value: "price_desc", label: "Giá: Cao đến Thấp" },
    { value: "newest", label: "Mới nhất" },
    { value: "rating_desc", label: "Đánh giá cao" },
    { value: "sold_desc", label: "Bán chạy" },
  ];

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Đã có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {query ? `Kết quả tìm kiếm cho "${query}"` : "Danh sách sản phẩm"}
            </h1>
            <p className="text-gray-600">Tìm thấy {totalResults} sản phẩm</p>
          </div>
        </div>

        {/* Active Filters Display */}
        {(activeFilters.category ||
          activeFilters.minPrice ||
          activeFilters.maxPrice) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Đang lọc:</span>

            {activeFilters.category && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Danh mục: {activeFilters.category}
                <button
                  onClick={() => handleFilterChange("category", "")}
                  className="ml-2"
                >
                  ×
                </button>
              </span>
            )}
            {/* Thêm hiển thị các filter khác tương tự... */}
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:underline ml-2"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar (Giữ nguyên logic hiển thị hoặc ẩn nếu không có data dynamic) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="font-bold mb-4">Bộ lọc</h3>

            {/* Filter Giá */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Khoảng giá
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={activeFilters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={activeFilters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            {/* Filter Sort Mobile/Desktop Sidebar */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Sắp xếp</label>
              <select
                value={activeFilters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full border rounded px-2 py-2 text-sm"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {totalResults === 0 ? (
            <EmptyState
              title="Không tìm thấy sản phẩm"
              description={`Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với từ khóa "${query}".`}
              icon="🔍"
            >
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Xem tất cả sản phẩm
              </button>
            </EmptyState>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 bg-gray-100 rounded">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
