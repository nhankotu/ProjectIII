import React, { useState, useEffect } from "react";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]); // Sản phẩm đã lọc

  useEffect(() => {
    // Giả sử bạn đã có một API để lấy tất cả sản phẩm
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Hiển thị tất cả sản phẩm ban đầu
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  // Hàm xử lý khi người dùng nhập tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredProducts(products); // Nếu không có từ khóa tìm kiếm, hiển thị tất cả sản phẩm
    } else {
      // Lọc sản phẩm theo tên (case-insensitive)
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="search-page">
      <h2>Tìm kiếm sản phẩm</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.imgUrl}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Giá: {product.price} VND</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}
    </div>
  );
}

export default SearchPage;
