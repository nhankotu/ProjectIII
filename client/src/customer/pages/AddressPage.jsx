import React, { useState } from "react";
// 🔥 ĐÃ THÊM 'X' VÀO DANH SÁCH IMPORT
import {
  Plus,
  Loader2,
  Edit,
  Trash2,
  MapPin,
  CheckCircle2,
  X,
} from "lucide-react";
import { userAPI } from "../services/api";

const AddressTab = ({ addresses = [], onAddressUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    phone: "",
    address: "",
    isDefault: false,
  });

  const addressList = Array.isArray(addresses) ? addresses : [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      fullName: "",
      phone: "",
      address: "",
      isDefault: false,
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const validateForm = () => {
    const { name, fullName, phone, address } = formData;
    if (!name.trim() || !fullName.trim() || !phone.trim() || !address.trim()) {
      alert("Vui lòng điền đầy đủ các trường thông tin bắt buộc.");
      return false;
    }
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      alert("Số điện thoại không đúng định dạng.");
      return false;
    }
    return true;
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingId) {
        await userAPI.updateAddress(editingId, formData);
      } else {
        await userAPI.addAddress(formData);
      }

      resetForm();
      if (onAddressUpdate) onAddressUpdate();
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra khi lưu địa chỉ.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await userAPI.deleteAddress(id);
      if (onAddressUpdate) onAddressUpdate();
    } catch (error) {
      alert(error.message || "Không thể xóa địa chỉ.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userAPI.setDefaultAddress(id);
      if (onAddressUpdate) onAddressUpdate();
    } catch (error) {
      alert(error.message || "Không thể đặt làm mặc định.");
    }
  };

  const startEdit = (address) => {
    setEditingId(address._id);
    setFormData({
      name: address.name,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      isDefault: address.isDefault,
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Sổ địa chỉ</h3>
          <p className="text-sm text-gray-500">
            Quản lý các địa chỉ nhận hàng của bạn
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={addressList.length >= 5}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            addressList.length >= 5
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          }`}
        >
          <Plus size={18} />
          Thêm địa chỉ mới
        </button>
      </div>

      {showAddForm && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative">
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <MapPin size={18} />
            {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ giao hàng mới"}
          </h4>

          <form
            onSubmit={handleSaveAddress}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Tên gợi nhớ (Ví dụ: Nhà riêng)
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Nhà riêng / Công ty"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Họ và tên người nhận
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Số điện thoại
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="09xxx"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Địa chỉ chi tiết
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-600">
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {editingId ? "Lưu cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addressList.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 italic">Bạn chưa lưu địa chỉ nào.</p>
          </div>
        ) : (
          addressList.map((addr) => (
            <div
              key={addr._id}
              className={`relative p-5 rounded-xl border-2 transition-all ${
                addr.isDefault
                  ? "border-indigo-600 bg-white shadow-sm"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200"
              }`}
            >
              {addr.isDefault && (
                <div className="absolute top-4 right-4 text-indigo-600 flex items-center gap-1 text-xs font-bold uppercase">
                  <CheckCircle2 size={14} /> Mặc định
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="mb-3">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                    {addr.name}
                  </span>
                  <h5 className="font-bold text-gray-900">{addr.fullName}</h5>
                  <p className="text-sm text-gray-600 font-medium">
                    {addr.phone}
                  </p>
                </div>

                <p className="text-sm text-gray-500 mb-4 flex-grow italic">
                  {addr.address}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex gap-4">
                    <button
                      onClick={() => startEdit(addr)}
                      className="text-gray-400 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Edit size={14} /> Sửa
                    </button>
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleDelete(addr._id)}
                        className="text-gray-400 hover:text-red-600 flex items-center gap-1 text-sm font-medium transition-colors"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    )}
                  </div>

                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      className="text-xs font-bold text-gray-400 hover:text-indigo-600 underline transition-colors"
                    >
                      Đặt mặc định
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressTab;
