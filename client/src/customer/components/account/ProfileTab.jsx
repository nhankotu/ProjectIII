import React, { useState, useRef, useEffect } from "react"; // Thêm useEffect
import { Camera, Loader2, Save, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { userAPI } from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProfileTab = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // 🔥 QUAN TRỌNG: Cập nhật form khi user từ null -> có dữ liệu (do fetch xong)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const getAvatarUrl = (avatarData) => {
    if (!avatarData) return "https://placehold.co/150?text=No+Avatar";
    const url = typeof avatarData === "object" ? avatarData.url : avatarData;
    return `${url}?t=${new Date().getTime()}`;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await userAPI.uploadAvatar(file);
      // Backend của bạn trả về { success, user, message }
      if (result.success || result.user) {
        updateUser(result.user || result);
        alert("Đổi ảnh đại diện thành công!");
      }
    } catch (error) {
      alert(error.message || "Lỗi upload");
    } finally {
      setUploading(false);
      if (event.target) event.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await userAPI.updateProfile(formData);
      // Kết quả từ interceptor thường là dữ liệu trực tiếp
      if (result.success || result.user) {
        updateUser(result.user || result);
        alert("Cập nhật thành công!");
        setIsEditing(false);
      }
    } catch (error) {
      alert(error.message || "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  // Nếu đang reload mà user chưa kịp load từ DB
  if (!user && !formData.email) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* ... Phần JSX giữ nguyên ... */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm">
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto bg-gray-50 flex items-center justify-center">
              <img
                src={getAvatarUrl(user?.avatar)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
              type="button"
            >
              <Camera size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <h3 className="font-bold text-xl text-gray-800">
            {user?.name || "Khách hàng"}
          </h3>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Thông tin tài khoản
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing || loading}
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${
                    isEditing ? "border-blue-300" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing || loading}
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${
                    isEditing ? "border-blue-300" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>
            </div>
            {/* ... Email input và nút Save giữ nguyên ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-lg border bg-gray-100 text-gray-400 cursor-not-allowed"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-lg border text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white flex items-center gap-2"
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
