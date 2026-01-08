import React from "react";
// Sửa đường dẫn import cho đúng cấu trúc thư mục
import PendingFlashSales from "../components/PendingFlashSales";

const FlashSalesPage = () => {
  return (
    <div className="py-6 px-4 sm:px-6 md:px-8">
      {/* Header của trang */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Duyệt Flash Sale</h1>
        <p className="text-gray-500 mt-1">
          Các chương trình khuyến mãi từ Seller đang chờ phê duyệt
        </p>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-7xl mx-auto">
        <PendingFlashSales />
      </div>
    </div>
  );
};

export default FlashSalesPage;
