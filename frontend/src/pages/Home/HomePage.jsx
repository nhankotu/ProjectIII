import React, { useState } from "react";
import CategoryList from "../../components/CategoryList";

function HomePage() {
  const [categoryNames, setCategoryNames] = useState([]); // Lưu danh sách tên danh mục

  // Hàm xử lý khi nhận danh sách tên danh mục từ CategoryList
  const handleCategoryNamesFetched = (names) => {
    setCategoryNames(names);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Banner có chữ chồng lên */}
      <div className="relative w-full h-[300px]">
        {/* Ảnh banner */}
        <img
          src="/Image/image.png"
          alt="Banner"
          className="w-full h-full object-cover rounded-md shadow-md"
        />

        {/* Chữ đè lên banner */}
        <div className="absolute bottom-14 right-9">
          <h1 className="text-4xl sm:text-5xl font-extrabold italic text-yellow-300 tracking-wide font-serif drop-shadow-[2px_2px_6px_rgba(0,0,0,0.7)]">
            NTH-SHOP
          </h1>
        </div>
      </div>

      {/* ✅ Sửa container để chiếm toàn bộ chiều rộng */}
      <div className="w-full px-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <CategoryList onCategoryNamesFetched={handleCategoryNamesFetched} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
