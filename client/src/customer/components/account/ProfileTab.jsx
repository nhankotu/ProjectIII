import React, { useState, useRef, useEffect } from "react";
import { Camera, Loader2, Calendar, User as UserIcon } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { userAPI } from "../../services/api";

const ProfileTab = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false); // Xử lý ảnh lỗi
  const fileInputRef = useRef(null);

  // 1. Cấu hình State khớp với Backend
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "other", // male, female, other
    dateOfBirth: "", // YYYY-MM-DD
  });

  // 2. Load dữ liệu từ User Context vào Form
  useEffect(() => {
    if (user) {
      // Xử lý ngày sinh: MongoDB lưu ISO (2000-01-01T00:00...), Input cần YYYY-MM-DD
      let formattedDate = "";
      if (user.dateOfBirth) {
        formattedDate = new Date(user.dateOfBirth).toISOString().split("T")[0];
      }

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "other",
        dateOfBirth: formattedDate,
      });
      setImageError(false); // Reset lỗi ảnh khi đổi user
    }
  }, [user]);

  // Handle Upload Avatar
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate kích thước (VD: max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB");
      return;
    }

    try {
      setUploading(true);
      const result = await userAPI.uploadAvatar(file);

      if (result.success || result.user) {
        updateUser(result.user || result); // Cập nhật Context
        alert("Đổi ảnh đại diện thành công!");
      }
    } catch (error) {
      alert(error.message || "Lỗi upload ảnh");
    } finally {
      setUploading(false);
      if (event.target) event.target.value = "";
    }
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend cần: name, phone, gender, dateOfBirth
      const result = await userAPI.updateProfile(formData);

      if (result.success || result.user) {
        updateUser(result.user || result.data || result); // Cập nhật Context
        alert("Cập nhật hồ sơ thành công!");
        setIsEditing(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Cancel
  const handleCancel = () => {
    // Reset lại form về dữ liệu gốc
    let formattedDate = "";
    if (user?.dateOfBirth) {
      formattedDate = new Date(user.dateOfBirth).toISOString().split("T")[0];
    }
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "other",
      dateOfBirth: formattedDate,
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* --- CỘT TRÁI: AVATAR --- */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm sticky top-24">
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner mx-auto bg-gray-50 flex items-center justify-center relative group">
              {user.avatar && !imageError ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 font-bold text-4xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 shadow-md transition-transform active:scale-95 border-2 border-white"
              title="Đổi ảnh đại diện"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <h3 className="font-bold text-xl text-gray-800 break-words">
            {user?.name || "Khách hàng"}
          </h3>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
            Thành viên chính thức
          </div>
        </div>
      </div>

      {/* --- CỘT PHẢI: FORM --- */}
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <UserIcon size={20} className="text-indigo-600" />
              Thông tin cá nhân
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Họ tên */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing || loading}
                  className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${
                    isEditing
                      ? "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing || loading}
                  className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${
                    isEditing
                      ? "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                />
              </div>

              {/* Email (Read only) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ Email{" "}
                  <span className="text-xs font-normal text-gray-400">
                    (Không thể thay đổi)
                  </span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* 🔥 THÊM: Ngày sinh */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    disabled={!isEditing || loading}
                    className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${
                      isEditing
                        ? "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  />
                  {!isEditing && (
                    <Calendar
                      className="absolute right-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  )}
                </div>
              </div>

              {/* 🔥 THÊM: Giới tính */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  disabled={!isEditing || loading}
                  className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all appearance-none ${
                    isEditing
                      ? "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  Lưu thay đổi
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
