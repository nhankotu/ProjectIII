import React, { useEffect, useState } from "react";
import { useAdminUsers } from "../hooks/useAdminUsers";
import {
  Search,
  UserCheck,
  Ban,
  Shield,
  Unlock,
  User as UserIcon,
} from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

const UsersPage = () => {
  // Lấy thêm hàm unbanUser từ hook
  const { users, loading, fetchUsers, approveSeller, banUser, unbanUser } =
    useAdminUsers();

  // State quản lý bộ lọc & Modal
  const [roleFilter, setRoleFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalMode, setModalMode] = useState("ban"); // "ban" hoặc "unban"

  // Gọi API khi filter thay đổi
  useEffect(() => {
    const params = {};
    if (roleFilter !== "all") params.role = roleFilter;
    fetchUsers(params);
  }, [roleFilter, fetchUsers]);

  // --- Xử lý Action ---

  // 1. Mở Modal Khóa
  const onBanClick = (userId) => {
    setSelectedUserId(userId);
    setModalMode("ban");
    setIsModalOpen(true);
  };

  // 2. Mở Modal Mở Khóa
  const onUnbanClick = (userId) => {
    setSelectedUserId(userId);
    setModalMode("unban");
    setIsModalOpen(true);
  };

  // 3. Xác nhận hành động trong Modal (Dùng chung cho cả Ban/Unban)
  const handleConfirmAction = async () => {
    if (!selectedUserId) return;

    let success = false;
    if (modalMode === "ban") {
      success = await banUser(selectedUserId);
    } else {
      success = await unbanUser(selectedUserId);
    }

    if (success) {
      setIsModalOpen(false);
      setSelectedUserId(null);
    }
  };

  // 4. Duyệt Seller
  const handleApprove = (userId) => {
    approveSeller(userId);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
        <p className="text-gray-500">
          Kiểm soát tài khoản Khách hàng và Người bán
        </p>
      </div>

      {/* --- Filter Tabs --- */}
      <div className="bg-white p-2 rounded-lg shadow-sm border inline-flex mb-6">
        {["all", "customer", "seller"].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              roleFilter === role
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {role === "all" ? "Tất cả" : role}
          </button>
        ))}
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-600">User Info</th>
              <th className="p-4 font-medium text-gray-600">Vai trò</th>
              <th className="p-4 font-medium text-gray-600">Trạng thái</th>
              <th className="p-4 font-medium text-gray-600 text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  Đang tải danh sách...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  Không tìm thấy user nào
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "seller"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role === "admin" && <Shield size={12} />}
                      {user.role === "seller" && <UserCheck size={12} />}
                      {user.role === "customer" && <UserIcon size={12} />}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    {user.isActive ? (
                      <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded border border-green-100">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded border border-red-100">
                        Đã khóa
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Nút Duyệt Shop cho Seller chưa kích hoạt */}
                      {user.role === "seller" && !user.isActive && (
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium transition"
                        >
                          <UserCheck size={14} /> Duyệt Shop
                        </button>
                      )}

                      {/* Logic nút Khóa / Mở khóa */}
                      {user.role !== "admin" &&
                        (user.isActive ? (
                          <button
                            onClick={() => onBanClick(user._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded hover:bg-red-100 text-xs font-medium transition"
                          >
                            <Ban size={14} /> Khóa
                          </button>
                        ) : (
                          // Nút Mở khóa chỉ hiện khi User đang bị khóa
                          <button
                            onClick={() => onUnbanClick(user._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 border border-green-100 rounded hover:bg-green-100 text-xs font-medium transition"
                          >
                            <Unlock size={14} /> Mở khóa
                          </button>
                        ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Modal Xác nhận Đa năng --- */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={modalMode === "ban" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        message={
          modalMode === "ban"
            ? "Hành động này sẽ ngăn người dùng đăng nhập và ẩn cửa hàng của họ. Bạn có chắc chắn không?"
            : "Hành động này sẽ khôi phục quyền truy cập cho người dùng và hiển thị lại cửa hàng của họ."
        }
        confirmText={modalMode === "ban" ? "Khóa ngay" : "Mở khóa ngay"}
        cancelText="Hủy bỏ"
        type={modalMode === "ban" ? "danger" : "success"}
        isLoading={loading}
      />
    </div>
  );
};

export default UsersPage;
