import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ProductCard from "../components/common/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import { useProducts } from "../components/hooks/useProducts";
import { useCategories } from "../components/hooks/useMockData";
import { useCart } from "../components/hooks/useCart";
import { Filter, Grid, List, ChevronDown, X } from "lucide-react";

const ProductListingPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const { products, loading, error } = useProducts({
    category: slug,
    search: searchQuery,
  });

  const categories = useCategories();
  const { addToCart } = useCart();

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get current category
  const currentCategory = categories.find((cat) => cat.slug === slug);

  // Filter products based on selections
  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "rating_desc":
          return b.rating - a.rating;
        case "best_seller":
          return b.soldCount - a.soldCount;
        case "newest":
        default:
          return b.id - a.id;
      }
    });

    return filtered;
  }, [products, priceRange, selectedBrands, sortBy]);

  // Get unique brands from products
  const brands = React.useMemo(() => {
    const brandSet = new Set(products.map((product) => product.brand));
    return Array.from(brandSet).filter(Boolean);
  }, [products]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 50000000]);
    setSelectedBrands([]);
    setSortBy("newest");
  };

  if (loading) {
    return <LoadingSpinner size="xl" text="Đang tải sản phẩm..." />;
  }

  if (error) {
    return (
      <EmptyState
        type="products"
        title="Lỗi tải dữ liệu"
        description={error}
        actionText="Thử lại"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {searchQuery
                ? `Kết quả tìm kiếm: "${searchQuery}"`
                : currentCategory?.name || "Tất cả sản phẩm"}
            </h1>
            <p className="text-gray-600 mt-2">
              {filteredProducts.length} sản phẩm
              {searchQuery && ` cho "${searchQuery}"`}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-10 w-10"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-10 w-10"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price_asc">Giá thấp đến cao</SelectItem>
                <SelectItem value="price_desc">Giá cao đến thấp</SelectItem>
                <SelectItem value="name_asc">Tên A-Z</SelectItem>
                <SelectItem value="name_desc">Tên Z-A</SelectItem>
                <SelectItem value="rating_desc">Đánh giá cao</SelectItem>
                <SelectItem value="best_seller">Bán chạy</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          {currentCategory && (
            <>
              <span className="mx-2">/</span>
              <Link
                to={`/category/${currentCategory.slug}`}
                className="hover:text-blue-600"
              >
                {currentCategory.name}
              </Link>
            </>
          )}
          {searchQuery && (
            <>
              <span className="mx-2">/</span>
              <span>Tìm kiếm</span>
            </>
          )}
        </nav>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-64 flex-shrink-0`}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Bộ lọc</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Khoảng giá</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={50000000}
                  step={100000}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Thương hiệu</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Danh mục</h4>
                <div className="space-y-2">
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className={`block text-sm p-2 rounded hover:bg-gray-50 ${
                        slug === category.slug
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <EmptyState
              type="search"
              title="Không tìm thấy sản phẩm"
              description="Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác"
              actionText="Xem tất cả sản phẩm"
              onAction={clearFilters}
            />
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  variant={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default ProductListingPage;
