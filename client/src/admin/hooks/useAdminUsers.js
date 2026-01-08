import { useState, useCallback } from "react";
import { toast } from "sonner";
import adminApi from "../services/adminApi";

export const useAdminUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});

  // 1. Lấy danh sách người dùng
  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      // Gọi API: GET /api/admin/users
      const response = await adminApi.getUsers(params);

      // Axios response.data thường chứa { users: [...], pagination: {...} }
      const data = response.data;

      setUsers(data.users || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Duyệt Seller (Kích hoạt tài khoản)
  const approveSeller = useCallback(async (userId) => {
    setLoading(true);
    try {
      await adminApi.approveSeller(userId);
      toast.success("Đã duyệt Seller thành công");

      // Cập nhật State tại chỗ (Optimistic UI)
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: true } : user
        )
      );
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi khi duyệt seller";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Khóa tài khoản (User hoặc Seller)
  const banUser = useCallback(async (userId) => {
    // Lưu ý: Không dùng window.confirm ở đây nữa
    setLoading(true);
    try {
      await adminApi.banUser(userId);
      toast.success("Đã khóa tài khoản");

      // Cập nhật State tại chỗ
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: false } : user
        )
      );
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi khi khóa tài khoản";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  // 4. THÊM MỚI: Mở khóa tài khoản
  const unbanUser = useCallback(async (userId) => {
    setLoading(true);
    try {
      await adminApi.unbanUser(userId); // Giả định adminApi có hàm unbanUser
      toast.success("Đã mở khóa tài khoản thành công");
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: true } : user
        )
      );
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi mở khóa");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    users,
    pagination,
    fetchUsers,
    approveSeller,
    banUser,
    unbanUser,
  };
};
