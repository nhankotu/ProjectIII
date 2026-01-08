import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import ProductCard from "../components/common/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import SearchBar from "../components/common/SearchBar";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 10000000 },
    brands: [],
    ratings: [],
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

        const params = {
          q: query,
          category: activeFilters.category,
          minPrice: activeFilters.minPrice,
          maxPrice: activeFilters.maxPrice,
          sort: activeFilters.sort,
          page,
          limit: 12,
        };

        const response = await productService.searchProducts(query, params);

        setProducts(response.products || response);
        setTotalResults(response.total || response.length || 0);
        setTotalPages(
          response.totalPages ||
            Math.ceil((response.total || response.length) / 12)
        );

        // Extract filters from response
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

    if (query || category) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setTotalResults(0);
      setLoading(false);
    }
  }, [query, category, activeFilters, page]);

  // Update URL when filters change
  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (page > 1) params.set("page", page);

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
    { value: "relevance", label: "Relevance" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" },
  ];

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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Search Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {query ? `Search Results for "${query}"` : "Browse Products"}
            </h1>
            <p className="text-gray-600">
              {totalResults} {totalResults === 1 ? "product" : "products"} found
            </p>
          </div>

          <div className="w-full md:w-auto">
            <SearchBar defaultValue={query} />
          </div>
        </div>

        {/* Active Filters */}
        {(activeFilters.category ||
          activeFilters.minPrice ||
          activeFilters.maxPrice) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Active filters:</span>

            {activeFilters.category && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Category:{" "}
                {filters.categories.find((c) => c.id === activeFilters.category)
                  ?.name || activeFilters.category}
                <button
                  onClick={() => handleFilterChange("category", "")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}

            {activeFilters.minPrice && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Min: {activeFilters.minPrice}₫
                <button
                  onClick={() => handleFilterChange("minPrice", "")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}

            {activeFilters.maxPrice && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Max: {activeFilters.maxPrice}₫
                <button
                  onClick={() => handleFilterChange("maxPrice", "")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Categories Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {filters.categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.category === category.id}
                      onChange={() =>
                        handleFilterChange(
                          "category",
                          activeFilters.category === category.id
                            ? ""
                            : category.id
                        )
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">{category.name}</span>
                    <span className="ml-auto text-gray-500 text-sm">
                      ({category.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={activeFilters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={activeFilters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <button
                  onClick={() =>
                    handleFilterChange("minPrice", "") &
                    handleFilterChange("maxPrice", "")
                  }
                  className="w-full py-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear price filter
                </button>
              </div>
            </div>

            {/* Brand Filter */}
            {filters.brands.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filters.brands.map((brand) => (
                    <label key={brand.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">{brand.name}</span>
                      <span className="ml-auto text-gray-500 text-sm">
                        ({brand.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div className="flex ml-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-700">& up</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Availability</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="ml-3 text-gray-700">In Stock Only</span>
              </label>
            </div>

            {/* Sale Filter */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Deals</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.onSale}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, onSale: !prev.onSale }))
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="ml-3 text-gray-700">On Sale</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3">
          {/* Sort Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600">
                Showing {(page - 1) * 12 + 1} -{" "}
                {Math.min(page * 12, totalResults)} of {totalResults} products
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Sort by:</span>
                <select
                  value={activeFilters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="hidden md:flex items-center space-x-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {totalResults === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your search or filter to find what you're looking for."
              icon="🔍"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Browse All Products
                </button>
              </div>
            </EmptyState>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-lg ${
                        page === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      ← Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            page === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="px-2 text-gray-500">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        page === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Next →
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}

          {/* Search Tips */}
          {totalResults === 0 && query && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-lg mb-3">Search Tips</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Check your spelling and try again
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Try using more general keywords
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Browse by category instead
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
