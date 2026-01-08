import { useState } from "react";
import { userAPI } from "../services/api"; // Import API chuẩn
import { useAuth } from "./useAuth";

export const useUserProfile = () => {
  const { user } = useAuth(); // Chỉ lấy user để hiển thị nếu cần
  const [loading, setLoading] = useState(false);

  // Cập nhật thông tin cá nhân (Tên, Avatar...)
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await userAPI.updateProfile(profileData);
      setLoading(false);
      return { success: true, data: response.data || response };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Cập nhật thất bại",
      };
    }
  };

  // --- CÁC HÀM XỬ LÝ ĐỊA CHỈ (GỌI API THỰC TẾ) ---

  const addAddress = async (addressData) => {
    setLoading(true);
    try {
      // Gọi API POST /users/address
      await userAPI.addAddress(addressData);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error("Lỗi thêm địa chỉ:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Thêm địa chỉ thất bại",
      };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    setLoading(true);
    try {
      // Gọi API PUT /users/address/:id
      await userAPI.updateAddress(addressId, addressData);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error("Lỗi sửa địa chỉ:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Cập nhật thất bại",
      };
    }
  };

  const deleteAddress = async (addressId) => {
    setLoading(true);
    try {
      // Gọi API DELETE /users/address/:id
      await userAPI.deleteAddress(addressId);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error("Lỗi xóa địa chỉ:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Xóa địa chỉ thất bại",
      };
    }
  };

  const setDefaultAddress = async (addressId) => {
    setLoading(true);
    try {
      // Gọi API PUT /users/address/:id/default
      await userAPI.setDefaultAddress(addressId);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error("Lỗi đặt mặc định:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Đặt mặc định thất bại",
      };
    }
  };

  return {
    user,
    loading,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
