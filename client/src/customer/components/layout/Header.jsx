import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
  Phone,
  MapPin,
} from "lucide-react";
import SearchBar from "../common/SearchBar";
import { useCart } from "../hooks/useCart";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const categories = [
    { name: "Điện Thoại", slug: "dien-thoai" },
    { name: "Laptop", slug: "laptop" },
    { name: "Tablet", slug: "tablet" },
    { name: "Phụ Kiện", slug: "phu-kien" },
    { name: "Đồng Hồ", slug: "dong-ho" },
    { name: "Âm Thanh", slug: "am-thanh" },
  ];

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>Hotline: 1900 1234</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>Hà Nội</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/track-order" className="hover:underline">
                Theo dõi đơn hàng
              </Link>
              <Link to="/support" className="hover:underline">
                Hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">YourShop</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemsCount > 99 ? "99+" : itemsCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Account */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Navigation */}
        <nav className="hidden md:block border-t">
          <div className="flex items-center space-x-8 py-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-4">
              <div className="font-semibold text-gray-900">Danh mục</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="text-sm text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t">
                <Link
                  to="/account"
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Tài khoản</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  <span>Yêu thích</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
