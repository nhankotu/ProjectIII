import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const SearchBar = ({ className = "", onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      }
      setSearchTerm("");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 py-2 w-full"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Suggestions - có thể phát triển sau */}
      {/* {searchTerm && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1">
          <div className="p-2 text-sm text-gray-500">
            Gợi ý: "iphone", "laptop", "giày thể thao"
          </div>
        </div>
      )} */}
    </form>
  );
};

export default SearchBar;
