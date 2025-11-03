import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Camera, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const API_BASE = import.meta.env.VITE_API_URL;

const ProfileTab = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Xử lý click đổi avatar
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Xử lý upload avatar
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh (JPEG, PNG, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập lại");
        return;
      }

      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append("avatar", file);

      console.log("🔄 Uploading avatar...");

      const response = await fetch(`${API_BASE}/api/users/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // KHÔNG có Content-Type, browser sẽ tự set
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload thất bại");
      }

      const result = await response.json();
      console.log("✅ Avatar uploaded:", result);

      // Cập nhật user trong context
      if (result.user) {
        updateUser(result.user);
        alert("Cập nhật ảnh đại diện thành công!");
      }
    } catch (error) {
      console.error("❌ Lỗi upload avatar:", error);
      alert(error.message || "Upload ảnh thất bại");
    } finally {
      setUploading(false);
      // Reset input file
      event.target.value = "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập lại");
        return;
      }

      // Gọi API update profile
      const response = await fetch(`${API_BASE}/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Cập nhật thất bại");
      }

      const result = await response.json();

      console.log("Update thành công:", result);

      // Cập nhật user trong Auth Context
      if (result.user) {
        updateUser(result.user);
      }

      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      alert(error.message || "Cập nhật thông tin thất bại");
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Avatar Card */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="relative inline-block">
            <img
              src={user.avatar || "/api/placeholder/100/100"}
              alt="Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <h3 className="text-xl font-semibold">
            {user.name || user.username}
          </h3>
          <p className="text-gray-600">{user.email}</p>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={uploading}
          />

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleAvatarClick}
            disabled={uploading}
          >
            <Camera className="h-4 w-4 mr-2" />
            {uploading ? "Đang tải lên..." : "Đổi ảnh đại diện"}
          </Button>

          <p className="text-xs text-gray-500 mt-2">
            JPEG, PNG, GIF • Tối đa 5MB
          </p>
        </CardContent>
      </Card>

      {/* Profile Form Card */}
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Chỉnh sửa
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
                placeholder="Nhập email"
              />
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Hủy
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
