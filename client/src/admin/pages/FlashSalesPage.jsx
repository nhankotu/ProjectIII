import React, { useState } from "react";
import PendingFlashSales from "../components/PendingFlashSales";
import FlashSaleSessions from "../components/FlashSaleSessions"; // Component mới để tạo khung giờ
import { Calendar, CheckCircle } from "lucide-react";

const FlashSalesPage = () => {
  const [activeTab, setActiveTab] = useState("pending"); // 'sessions' hoặc 'pending'

  return (
    <div className="py-6 px-4 sm:px-6 md:px-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản trị Flash Sale
          </h1>
          <p className="text-gray-500 mt-1">
            Thiết lập khung giờ và phê duyệt sản phẩm từ người bán
          </p>
        </div>
      </div>

      {/* Tabs chuyển đổi */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 py-3 px-6 border-b-2 font-medium text-sm transition-all ${
            activeTab === "pending"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <CheckCircle size={18} />
          Chờ phê duyệt
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`flex items-center gap-2 py-3 px-6 border-b-2 font-medium text-sm transition-all ${
            activeTab === "sessions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Calendar size={18} />
          Quản lý Khung giờ
        </button>
      </div>

      {/* Nội dung thay đổi theo Tab */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "pending" ? (
          <PendingFlashSales />
        ) : (
          <FlashSaleSessions />
        )}
      </div>
    </div>
  );
};

export default FlashSalesPage;
