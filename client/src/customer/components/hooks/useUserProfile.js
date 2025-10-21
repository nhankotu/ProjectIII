import { useState } from "react";
import { useAuth } from "./useAuth";

export const useUserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateUserProfile = async (profileData) => {
    setLoading(true);
    const result = await updateProfile(profileData);
    setLoading(false);
    return result;
  };

  const addAddress = async (addressData) => {
    setLoading(true);

    try {
      const newAddress = {
        id: Date.now(), // Mock ID
        ...addressData,
        isDefault: false,
      };

      const updatedAddresses = [...(user.addresses || []), newAddress];
      const result = await updateProfile({ addresses: updatedAddresses });

      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Thêm địa chỉ thất bại" };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    setLoading(true);

    try {
      const updatedAddresses = user.addresses.map((addr) =>
        addr.id === addressId ? { ...addr, ...addressData } : addr
      );

      const result = await updateProfile({ addresses: updatedAddresses });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Cập nhật địa chỉ thất bại" };
    }
  };

  const deleteAddress = async (addressId) => {
    setLoading(true);

    try {
      const updatedAddresses = user.addresses.filter(
        (addr) => addr.id !== addressId
      );
      const result = await updateProfile({ addresses: updatedAddresses });

      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Xóa địa chỉ thất bại" };
    }
  };

  const setDefaultAddress = async (addressId) => {
    setLoading(true);

    try {
      const updatedAddresses = user.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      const result = await updateProfile({ addresses: updatedAddresses });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Đặt địa chỉ mặc định thất bại" };
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
