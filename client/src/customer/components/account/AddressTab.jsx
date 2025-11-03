import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL;

const AddressTab = ({ addresses = [], onAddressUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    phone: "",
    address: "",
    isDefault: false,
  });
  const [editingId, setEditingId] = useState(null);

  const addressList = addresses || [];

  // Lấy token từ localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Xử lý thay đổi form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }

    return true;
  };

  // Thêm địa chỉ mới - SỬA URL Ở ĐÂY
  const handleAddAddress = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE}/api/users/address`, {
        // ĐÃ SỬA THÀNH "address"
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Xử lý response tốt hơn
      if (!response.ok) {
        // Nếu response không phải JSON, đọc dưới dạng text
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      toast.success("Thêm địa chỉ thành công");
      resetForm();
      // DEBUG QUAN TRỌNG - Kiểm tra callback
      console.log("🔄 Checking onAddressUpdate...");
      console.log("onAddressUpdate exists:", !!onAddressUpdate);
      console.log("onAddressUpdate type:", typeof onAddressUpdate);
      if (onAddressUpdate) {
        onAddressUpdate();
      }
    } catch (error) {
      console.error("Error adding address:", error);
      if (error.message.includes("HTTP error! status: 404")) {
        toast.error("API endpoint không tồn tại. Vui lòng kiểm tra đường dẫn.");
      } else {
        toast.error(error.message || "Không thể thêm địa chỉ");
      }
    } finally {
      setLoading(false);
    }
  };

  // Sửa địa chỉ
  const handleEditAddress = (address) => {
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

  // Cập nhật địa chỉ - SỬA URL Ở ĐÂY
  const handleUpdateAddress = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE}/api/users/address/${editingId}`,
        {
          // ĐÃ SỬA THÀNH "address"
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      toast.success("Cập nhật địa chỉ thành công");
      resetForm();
      if (onAddressUpdate) {
        onAddressUpdate();
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(error.message || "Không thể cập nhật địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  // Xóa địa chỉ - SỬA URL Ở ĐÂY
  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE}/api/users/address/${addressId}`,
        {
          // ĐÃ SỬA THÀNH "address"
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      toast.success("Xóa địa chỉ thành công");
      if (onAddressUpdate) {
        onAddressUpdate();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(error.message || "Không thể xóa địa chỉ");
    }
  };

  // Đặt làm mặc định - SỬA URL Ở ĐÂY
  const handleSetDefault = async (addressId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE}/api/users/address/${addressId}/default`,
        {
          // ĐÃ SỬA THÀNH "address"
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      toast.success("Đã đặt làm địa chỉ mặc định");
      if (onAddressUpdate) {
        onAddressUpdate();
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(error.message || "Không thể đặt làm mặc định");
    }
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

  const handleSubmit = () => {
    if (editingId) {
      handleUpdateAddress();
    } else {
      handleAddAddress();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Địa chỉ giao hàng</h3>
          <Button
            onClick={() => setShowAddForm(true)}
            disabled={addressList.length >= 5}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm địa chỉ mới
          </Button>
        </div>

        {/* Form thêm/sửa địa chỉ */}
        {showAddForm && (
          <Card className="mb-6 border-2 border-dashed border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 text-blue-800">
                {editingId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
              </h4>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-sm font-medium">Tên địa chỉ *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Nhà riêng, Công ty..."
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Họ và tên *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0912345678"
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Địa chỉ *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, đường, phường, quận, thành phố..."
                    className="w-full p-2 border rounded mt-1 h-20"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="default-address"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="default-address" className="text-sm">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmit} disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {loading
                    ? "Đang xử lý..."
                    : editingId
                    ? "Cập nhật"
                    : "Lưu địa chỉ"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rest of your component remains the same */}
        <div className="grid md:grid-cols-2 gap-4">
          {addressList.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <div className="text-gray-400 mb-2">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500 mb-4">Chưa có địa chỉ nào được lưu</p>
              <Button onClick={() => setShowAddForm(true)}>
                Thêm địa chỉ đầu tiên
              </Button>
            </div>
          ) : (
            addressList.map((address) => (
              <Card
                key={address._id}
                className={`relative hover:shadow-md transition-shadow ${
                  address.isDefault
                    ? "border-2 border-green-200 bg-green-50"
                    : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      {address.isDefault && (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="font-semibold text-lg mb-1">{address.name}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {address.fullName}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{address.phone}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {address.address}
                  </p>

                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleSetDefault(address._id)}
                    >
                      Đặt làm mặc định
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {addressList.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 Bạn có thể thêm tối đa 5 địa chỉ giao hàng. Địa chỉ mặc định sẽ
              được sử dụng cho các đơn hàng mới.
            </p>
          </div>
        )}

        {addressList.length >= 5 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              ⚠️ Bạn đã đạt tối đa 5 địa chỉ. Vui lòng xóa bớt địa chỉ không sử
              dụng để thêm mới.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressTab;
