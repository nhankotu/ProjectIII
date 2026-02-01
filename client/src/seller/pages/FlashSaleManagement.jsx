import React, { useState } from "react";
import useFlashSale from "../hooks/useFlashSale";
import { Plus, Calendar, List } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

// Import các sub-components
import { AvailableEventsGrid } from "../components/flashsale/FlashSaleComponents";
import RegisteredTable from "../components/flashsale/RegisteredTable";
import RegistrationModal from "../components/flashsale/RegistrationModal";

const FlashSaleManagement = () => {
  const { flashSales, availableEvents, products, loading, registerProduct } =
    useFlashSale();

  const [activeTab, setActiveTab] = useState("events");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");

  const handleOpenModal = (eventId = "") => {
    setSelectedEventId(eventId);
    setShowModal(true);
  };

  const handleRegisterSubmit = async (formData) => {
    if (
      !formData.flashSaleId ||
      !formData.productId ||
      !formData.salePrice ||
      !formData.limitQuantity
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerProduct(formData);
      if (result.success) {
        alert(result.message);
        setShowModal(false);
        setActiveTab("registrations"); // Chuyển tab để user thấy kết quả
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Lỗi hệ thống");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Flash Sale
          </h1>
          <p className="text-gray-500 text-sm">
            Tham gia các khung giờ vàng để tăng doanh số
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 font-bold shadow-md transition-all"
        >
          <Plus size={18} /> Đăng ký nhanh
        </button>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("events")}
          className={`pb-3 px-2 flex items-center gap-2 font-medium text-sm transition-colors border-b-2 
          ${
            activeTab === "events"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar size={18} /> Sự kiện đang mở ({availableEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("registrations")}
          className={`pb-3 px-2 flex items-center gap-2 font-medium text-sm transition-colors border-b-2 
          ${
            activeTab === "registrations"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <List size={18} /> Lịch sử đăng ký ({flashSales.length})
        </button>
      </div>

      {/* CONTENT AREA */}
      {activeTab === "events" && (
        <AvailableEventsGrid
          events={availableEvents}
          onRegister={handleOpenModal}
        />
      )}

      {activeTab === "registrations" && (
        <RegisteredTable registrations={flashSales} />
      )}

      {/* MODAL */}
      <RegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleRegisterSubmit}
        events={availableEvents}
        products={products}
        initialEventId={selectedEventId}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default FlashSaleManagement;
