import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Product from "../../components/Product";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const fetchProducts = async (keyword = "") => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/search?keyword=${encodeURIComponent(
          keyword
        )}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("❌ Lỗi khi tìm kiếm sản phẩm:", error);
    }
  };

  const handleSearchClick = () => {
    fetchProducts(searchTerm);
  };

  return (
    <div className="search-page px-4 py-8 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center drop-shadow">
        🔍 Tìm kiếm sản phẩm
      </h2>

      <div className="flex items-center gap-2 justify-center mb-8">
        <div className="relative w-full max-w-lg">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <button
          onClick={handleSearchClick}
          className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2 rounded-md shadow transition-all duration-300"
        >
          Tìm kiếm
        </button>
      </div>

      {products.length > 0 ? (
        <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic mt-12">
          Không tìm thấy sản phẩm nào.
        </p>
      )}
    </div>
  );
}

export default SearchPage;
