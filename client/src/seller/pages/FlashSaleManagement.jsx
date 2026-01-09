import React, { useState } from "react";
import useFlashSale from "../hooks/useFlashSale";
import LoadingSpinner from "../components/LoadingSpinner";
import { Trash2, Plus } from "lucide-react"; // Cài lucide-react hoặc dùng icon khác

const FlashSaleManagement = () => {
  const { flashSales, products, loading, error, createFlashSale } =
    useFlashSale();

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- STATE CHO FORM CHIẾN DỊCH ---
  const [campaign, setCampaign] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });

  // --- STATE CHO SẢN PHẨM ĐANG CHỌN (TEMP) ---
  const [tempProduct, setTempProduct] = useState({
    productId: "",
    salePrice: "",
    limitQuantity: "",
  });

  // Danh sách các sản phẩm đã add vào chiến dịch hiện tại
  const [selectedItems, setSelectedItems] = useState([]);

  // --- HANDLERS ---

  // 1. Nhập thông tin chung (Tên, Thời gian)
  const handleCampaignChange = (e) => {
    setCampaign({ ...campaign, [e.target.name]: e.target.value });
  };

  // 2. Nhập thông tin sản phẩm con
  const handleTempProductChange = (e) => {
    setTempProduct({ ...tempProduct, [e.target.name]: e.target.value });
  };

  // 3. Thêm sản phẩm vào list tạm
  const handleAddProduct = () => {
    if (
      !tempProduct.productId ||
      !tempProduct.salePrice ||
      !tempProduct.limitQuantity
    ) {
      alert("Vui lòng chọn sản phẩm và nhập giá/số lượng");
      return;
    }

    // Tìm info sản phẩm gốc để hiển thị tên
    const productInfo = products.find(
      (p) => (p._id || p.id) === tempProduct.productId
    );

    const newItem = {
      product: tempProduct.productId, // Key khớp với BE yêu cầu
      salePrice: Number(tempProduct.salePrice),
      limitQuantity: Number(tempProduct.limitQuantity),
      name: productInfo?.name, // Để hiển thị UI
      originalPrice: productInfo?.price, // Để so sánh UI
    };

    setSelectedItems([...selectedItems, newItem]);

    // Reset inputs sản phẩm
    setTempProduct({ productId: "", salePrice: "", limitQuantity: "" });
  };

  // 4. Xóa sản phẩm khỏi list tạm
  const handleRemoveProduct = (index) => {
    const newList = [...selectedItems];
    newList.splice(index, 1);
    setSelectedItems(newList);
  };

  // 5. Gửi toàn bộ dữ liệu lên Server
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!campaign.title || !campaign.startTime || !campaign.endTime) {
      alert("Vui lòng nhập thông tin chiến dịch");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm");
      return;
    }

    setSubmitting(true);

    // Chuẩn bị payload khớp 100% với Controller Backend
    const payload = {
      title: campaign.title,
      startTime: campaign.startTime,
      endTime: campaign.endTime,
      products: selectedItems.map((item) => ({
        product: item.product,
        salePrice: item.salePrice,
        limitQuantity: item.limitQuantity,
      })),
    };

    const result = await createFlashSale(payload);
    setSubmitting(false);

    if (result.success) {
      alert("Tạo chiến dịch thành công! Chờ Admin duyệt.");
      setShowModal(false);
      // Reset toàn bộ
      setCampaign({ title: "", startTime: "", endTime: "" });
      setSelectedItems([]);
    } else {
      alert(`Lỗi: ${result.message}`);
    }
  };

  // Render Status Badge
  const renderStatus = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      ended: "bg-gray-100 text-gray-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-bold ${
          colors[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading)
    return (
      <div className="p-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="p-10 text-red-500">Lỗi kết nối: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Chiến dịch Flash Sale
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý các đợt giảm giá của Shop
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Tạo chiến dịch mới
        </button>
      </div>

      {/* DANH SÁCH CHIẾN DỊCH */}
      <div className="grid gap-6">
        {flashSales.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Chưa có chiến dịch nào
          </div>
        ) : (
          flashSales.map((sale) => (
            <div
              key={sale._id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-900">
                    {sale.title}
                  </h3>
                  <div className="text-sm text-gray-500 flex gap-4 mt-1">
                    <span>
                      📅 Bắt đầu:{" "}
                      {new Date(sale.startTime).toLocaleString("vi-VN")}
                    </span>
                    <span>
                      🔚 Kết thúc:{" "}
                      {new Date(sale.endTime).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
                {renderStatus(sale.status)}
              </div>

              {/* Danh sách sản phẩm trong chiến dịch này */}
              <div className="bg-gray-50 rounded-lg p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2">Sản phẩm</th>
                      <th className="pb-2">Giá gốc</th>
                      <th className="pb-2">Giá Flash Sale</th>
                      <th className="pb-2">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.products.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="py-2 font-medium">
                          {item.product?.name || "SP đã xóa"}
                        </td>
                        <td className="py-2 text-gray-400 line-through">
                          {item.product?.price?.toLocaleString()}đ
                        </td>
                        <td className="py-2 text-red-600 font-bold">
                          {item.salePrice?.toLocaleString()}đ
                        </td>
                        <td className="py-2">
                          {item.soldQuantity || 0} / {item.limitQuantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL TẠO CHIẾN DỊCH */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Đăng ký Flash Sale Mới
              </h2>

              <form onSubmit={handleSubmit}>
                {/* 1. Thông tin chung */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tên chương trình
                    </label>
                    <input
                      name="title"
                      value={campaign.title}
                      onChange={handleCampaignChange}
                      className="w-full border p-2 rounded"
                      placeholder="VD: Sale Sập Sàn 12/12"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Bắt đầu
                      </label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={campaign.startTime}
                        onChange={handleCampaignChange}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Kết thúc
                      </label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={campaign.endTime}
                        onChange={handleCampaignChange}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Thêm sản phẩm */}
                <div className="mb-6 border-t pt-4">
                  <h3 className="font-semibold mb-3">
                    Thêm sản phẩm vào chiến dịch
                  </h3>
                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <label className="text-xs mb-1 block">
                        Chọn sản phẩm
                      </label>
                      <select
                        name="productId"
                        value={tempProduct.productId}
                        onChange={handleTempProductChange}
                        className="w-full border p-2 rounded text-sm"
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map((p) => (
                          <option key={p._id || p.id} value={p._id || p.id}>
                            {p.name} (Gốc: {p.price?.toLocaleString()}đ)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs mb-1 block">Giá Sale</label>
                      <input
                        type="number"
                        name="salePrice"
                        value={tempProduct.salePrice}
                        onChange={handleTempProductChange}
                        className="w-full border p-2 rounded text-sm"
                        placeholder="VD: 50000"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs mb-1 block">Số lượng</label>
                      <input
                        type="number"
                        name="limitQuantity"
                        value={tempProduct.limitQuantity}
                        onChange={handleTempProductChange}
                        className="w-full border p-2 rounded text-sm"
                        placeholder="SL"
                      />
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={handleAddProduct}
                        className="w-full bg-green-600 text-white p-2 rounded text-sm hover:bg-green-700"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Danh sách đã thêm */}
                {selectedItems.length > 0 && (
                  <div className="mb-6 border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2">Sản phẩm</th>
                          <th className="p-2">Giá gốc</th>
                          <th className="p-2">Giá Sale</th>
                          <th className="p-2">SL</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedItems.map((item, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2 text-gray-500 line-through">
                              {item.originalPrice?.toLocaleString()}
                            </td>
                            <td className="p-2 font-bold text-red-600">
                              {item.salePrice?.toLocaleString()}
                            </td>
                            <td className="p-2">{item.limitQuantity}</td>
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {submitting ? "Đang gửi..." : "Hoàn tất đăng ký"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSaleManagement;
