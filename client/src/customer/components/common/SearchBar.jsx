import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI as productService } from "../../services/api";
import { Search, X, Loader2, ArrowRight } from "lucide-react"; // Dùng icon từ lucide-react cho đẹp (hoặc dùng svg cũ nếu chưa cài)

const SearchBar = ({ defaultValue = "", className = "", onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch API gợi ý
  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);

      const res = await productService.getAll({
        keyword: searchQuery,
        limit: 5,
      });

      const products = res.data || [];

      const apiSuggestions = products.map((p) => ({
        id: p._id,
        type: "product",
        name: p.name,
        category: p.category?.name || "Sản phẩm",
        thumbnail: p.thumbnail,
        slug: p.slug,
      }));

      setSuggestions(apiSuggestions);
    } catch (error) {
      console.error("Lỗi gợi ý tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce hoặc gọi luôn tùy nhu cầu
    fetchSuggestions(value);

    if (value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setShowSuggestions(false);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    navigate(`/product/${suggestion.id}`);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Từ khóa phổ biến (Fix cứng hoặc lấy API)
  const popularSearches = [
    "Áo thun",
    "iPhone 15",
    "Giày Sneaker",
    "Tai nghe Bluetooth",
    "Váy hoa",
  ];

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* 1. Icon trang trí bên trái */}
        <div className="absolute left-4 text-gray-400 pointer-events-none">
          <Search size={20} />
        </div>

        {/* 2. Input chính */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder="Bạn tìm gì hôm nay?"
          className="w-full h-12 pl-12 pr-28 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm sm:text-base truncate"
        />

        {/* 3. Khu vực nút bấm bên phải */}
        <div className="absolute right-1.5 flex items-center gap-1">
          {/* Nút Loading / Clear */}
          {loading ? (
            <div className="p-2 text-blue-500">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Xóa tìm kiếm"
            >
              <X size={18} />
            </button>
          ) : null}

          {/* 🔥 NÚT TÌM KIẾM CHÍNH (Button Submit) */}
          <button
            type="submit"
            className="h-9 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-md"
            title="Tìm kiếm"
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* --- PHẦN GỢI Ý (DROPDOWN) --- */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Gợi ý sản phẩm từ API */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Gợi ý cho bạn
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                    <img
                      src={
                        suggestion.thumbnail || "https://via.placeholder.com/40"
                      }
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate group-hover:text-blue-600">
                      {suggestion.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Không có kết quả */}
          {suggestions.length === 0 && query.length >= 2 && !loading && (
            <div className="p-6 text-center text-gray-500">
              <p>Không tìm thấy sản phẩm nào.</p>
            </div>
          )}

          {/* Từ khóa phổ biến (Khi chưa gõ gì hoặc không có kết quả) */}
          {(suggestions.length === 0 || query.length < 2) && (
            <div className="border-t border-gray-100 bg-gray-50/50 p-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                🔥 Xu hướng tìm kiếm
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      navigate(`/search?q=${encodeURIComponent(term)}`);
                      setShowSuggestions(false);
                    }}
                    className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer: Xem tất cả */}
          {query.length >= 2 && (
            <div className="p-2 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
              >
                Xem tất cả kết quả cho "{query}" <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
