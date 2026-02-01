import React, { useState, useEffect } from "react";
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

const AddressPage = () => {
  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [addresses, setAddresses] = useState([]); // Danh sách địa chỉ
  const [pageLoading, setPageLoading] = useState(true); // Loading khi mới vào trang

  // State cho Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // State dữ liệu Form
  const [formData, setFormData] = useState({
    label: "Nhà riêng",
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    isDefault: false,
  });

  // --- 2. HÀM FETCH DỮ LIỆU (Tự gọi) ---
  const fetchAddresses = async () => {
    try {
      // setPageLoading(true); // Chỉ set true lần đầu hoặc khi cần thiết
      const res = await userAPI.getAddresses();
      const list = Array.isArray(res) ? res : res.data || [];
      setAddresses(list);
    } catch (error) {
      console.error("Lỗi tải địa chỉ:", error);
    } finally {
      setPageLoading(false);
    }
  };

  // Gọi API ngay khi Component được mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // --- 3. CÁC HÀM XỬ LÝ FORM ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      label: "Nhà riêng",
      fullName: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detailAddress: "",
      isDefault: false,
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const validateForm = () => {
    const { fullName, phone, province, district, ward, detailAddress } =
      formData;
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !province.trim() ||
      !district.trim() ||
      !ward.trim() ||
      !detailAddress.trim()
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ.");
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

    setFormLoading(true);
    try {
      if (editingId) {
        await userAPI.updateAddress(editingId, formData);
      } else {
        await userAPI.addAddress(formData);
      }
      resetForm();
      fetchAddresses(); // 🔥 Reload lại danh sách sau khi lưu
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi lưu địa chỉ.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await userAPI.deleteAddress(id);
      fetchAddresses(); // 🔥 Reload lại danh sách sau khi xóa
    } catch (error) {
      alert(error.response?.data?.message || "Không thể xóa địa chỉ.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userAPI.setDefaultAddress(id);
      fetchAddresses(); // 🔥 Reload lại danh sách sau khi set default
    } catch (error) {
      alert(error.response?.data?.message || "Không thể đặt làm mặc định.");
    }
  };

  const startEdit = (address) => {
    setEditingId(address._id);
    setFormData({
      label: address.label || "Nhà riêng",
      fullName: address.fullName || "",
      phone: address.phone || "",
      province: address.province || "", // Lưu ý mapping đúng field từ BE
      district: address.district || "",
      ward: address.ward || "",
      detailAddress: address.detailAddress || "", // Lưu ý mapping đúng field từ BE
      isDefault: address.isDefault || false,
    });
    setShowAddForm(true);
  };

  // --- 4. RENDER ---
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Sổ địa chỉ</h3>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý nhận hàng ({addresses.length}/10)
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={addresses.length >= 10}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
            addresses.length >= 10
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md active:scale-95"
          }`}
        >
          <Plus size={18} />
          Thêm địa chỉ mới
        </button>
      </div>

      {/* Form Thêm/Sửa */}
      {showAddForm && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm"
          >
            <X size={18} />
          </button>

          <h4 className="font-bold text-indigo-900 mb-5 flex items-center gap-2">
            <div className="p-2 bg-white rounded-full shadow-sm text-indigo-600">
              <MapPin size={18} />
            </div>
            {editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ giao hàng mới"}
          </h4>

          <form onSubmit={handleSaveAddress} className="space-y-4">
            {/* Loại địa chỉ */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block tracking-wide">
                Loại địa chỉ
              </label>
              <div className="flex gap-4">
                {["Nhà riêng", "Văn phòng"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                  >
                    <input
                      type="radio"
                      name="label"
                      value={type}
                      checked={formData.label === type}
                      onChange={handleInputChange}
                      className="text-indigo-600 w-4 h-4 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Họ và tên
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                  placeholder="VD: 0912345678"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Tỉnh / Thành phố
                </label>
                <input
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="input-std"
                  placeholder="Hà Nội"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Quận / Huyện
                </label>
                <input
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="input-std"
                  placeholder="Cầu Giấy"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Phường / Xã
                </label>
                <input
                  name="ward"
                  value={formData.ward}
                  onChange={handleInputChange}
                  className="input-std"
                  placeholder="Dịch Vọng"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Địa chỉ cụ thể
              </label>
              <input
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleInputChange}
                className="input-std w-full"
                placeholder="Số nhà, Tên đường, Tòa nhà..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="isDefault"
                className="text-sm text-gray-700 font-medium cursor-pointer"
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-indigo-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {formLoading && <Loader2 size={16} className="animate-spin" />}
                {editingId ? "Lưu thay đổi" : "Hoàn thành"}
              </button>
            </div>
          </form>
          <style>{`.input-std { width: 100%; padding: 10px 16px; border-radius: 8px; border: 1px solid #d1d5db; background-color: white; outline: none; transition: all 0.2s; } .input-std:focus { ring: 2px; ring-color: #6366f1; border-color: transparent; }`}</style>
        </div>
      )}

      {/* LIST ADDRESSES */}
      <div className="grid grid-cols-1 gap-4">
        {addresses.length === 0 ? (
          <div className="py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <MapPin className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-medium">
              Bạn chưa lưu địa chỉ nào.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Thêm địa chỉ để thanh toán nhanh hơn.
            </p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className={`relative p-5 rounded-xl border transition-all duration-200 group ${
                addr.isDefault
                  ? "border-indigo-600 bg-indigo-50/30 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1 shadow-sm">
                  <CheckCircle2 size={12} /> MẶC ĐỊNH
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 pr-8">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <span className="text-gray-900 font-bold text-lg">
                      {addr.fullName}
                    </span>
                    <span className="text-gray-300 hidden md:inline">|</span>
                    <span className="text-gray-600 font-medium">
                      {addr.phone}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ml-1 font-medium ${
                        addr.label === "Văn phòng"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-green-50 text-green-700 border-green-100"
                      }`}
                    >
                      {addr.label || "Nhà riêng"}
                    </span>
                  </div>

                  <p className="text-gray-800 text-sm font-medium mt-1">
                    {addr.detailAddress}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {addr.ward}, {addr.district}, {addr.province}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <button
                    onClick={() => startEdit(addr)}
                    className="flex-1 md:flex-none text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center md:text-right"
                  >
                    Cập nhật
                  </button>
                  {!addr.isDefault && (
                    <>
                      <button
                        onClick={() => handleDelete(addr._id)}
                        className="flex-1 md:flex-none text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center md:text-right"
                      >
                        Xóa
                      </button>
                      <button
                        onClick={() => handleSetDefault(addr._id)}
                        className="flex-1 md:flex-none text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center md:text-right whitespace-nowrap"
                      >
                        Thiết lập mặc định
                      </button>
                    </>
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

export default AddressPage;
