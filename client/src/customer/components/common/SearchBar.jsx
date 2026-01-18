import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI as productService } from "../../services/api";

const SearchBar = ({ defaultValue = "", className = "", onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions
  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      // Mock API call - replace with actual API
      const mockSuggestions = [
        {
          id: 1,
          type: "product",
          name: "iPhone 15 Pro",
          category: "Electronics",
        },
        {
          id: 2,
          type: "product",
          name: "Samsung Galaxy S24",
          category: "Electronics",
        },
        { id: 3, type: "product", name: "Nike Air Max", category: "Shoes" },
        {
          id: 4,
          type: "category",
          name: "Smartphones",
          category: "Categories",
        },
        { id: 5, type: "brand", name: "Apple", category: "Brands" },
      ].filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSuggestions(mockSuggestions.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);

    if (value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);

    if (suggestion.type === "product") {
      navigate(`/search?q=${encodeURIComponent(suggestion.name)}`);
    } else if (suggestion.type === "category") {
      navigate(`/category/${suggestion.name.toLowerCase()}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Popular Searches
  const popularSearches = [
    "Smartphone",
    "Laptop",
    "Headphones",
    "Watch",
    "Shoes",
    "T-shirt",
  ];

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for products, brands, categories..."
          className="w-full px-6 py-4 pl-12 pr-12 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Search Icon */}
        <button
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
        >
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {suggestions.length === 0 && query.length >= 2 && (
            <div className="p-4 text-center text-gray-500">
              No suggestions found for "{query}"
            </div>
          )}

          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Suggestions
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      suggestion.type === "product"
                        ? "bg-blue-100"
                        : suggestion.type === "category"
                        ? "bg-green-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {suggestion.type === "product" && "📱"}
                    {suggestion.type === "category" && "📁"}
                    {suggestion.type === "brand" && "🏷️"}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {suggestion.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {suggestion.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          <div className="border-t border-gray-200 py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Popular Searches
            </div>
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    navigate(`/search?q=${encodeURIComponent(term)}`);
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* View All Results */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
