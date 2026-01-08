// src/components/admin/Users/UserList.jsx
import React, { useEffect, useState } from "react";
import { useUsers } from "../../../hooks/admin/useUsers";
import ConfirmModal from "../Common/ConfirmModal";

const UserList = () => {
  const { loading, error, users, fetchAllUsers, approveSeller, banUser } =
    useUsers();

  const [filters, setFilters] = useState({
    role: "",
    status: "",
    search: "",
  });
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAllUsers(filters);
  }, [fetchAllUsers]);

  const handleApprove = async () => {
    try {
      await approveSeller(selectedUser.id);
      setShowApproveModal(false);
      setSelectedUser(null);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleBan = async () => {
    try {
      await banUser(selectedUser.id);
      setShowBanModal(false);
      setSelectedUser(null);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllUsers(filters);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "seller":
        return "Người bán";
      case "user":
        return "Người dùng";
      default:
        return role;
    }
  };

  const getStatusBadge = (user) => {
    if (user.isBanned) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          Đã khóa
        </span>
      );
    }
    if (user.role === "seller") {
      if (user.isApproved) {
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Đã duyệt
          </span>
        );
      } else {
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Chờ duyệt
          </span>
        );
      }
    }
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
        Hoạt động
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h2>
        <p className="mt-1 text-gray-600">
          Quản lý người dùng, duyệt seller và khóa tài khoản
        </p>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
        <form
          onSubmit={handleSearch}
          className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:space-x-4"
        >
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Tìm kiếm
            </label>
            <input
              type="text"
              id="search"
              placeholder="Tìm theo tên, email..."
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <div className="sm:w-40">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Vai trò
            </label>
            <select
              id="role"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">Tất cả</option>
              <option value="user">Người dùng</option>
              <option value="seller">Người bán</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="sm:w-40">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Trạng thái
            </label>
            <select
              id="status"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="pending">Chờ duyệt</option>
              <option value="banned">Đã khóa</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Lọc
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters({ role: "", status: "", search: "" });
              fetchAllUsers();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Đặt lại
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchAllUsers(filters)}
            className="px-4 py-2 mt-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
          >
            Thử lại
          </button>
        </div>
      )}

      {loading && users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 4.201V21m0 0h-6m6 0h6"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Không tìm thấy người dùng
          </h3>
          <p className="mt-1 text-gray-500">Thử thay đổi bộ lọc tìm kiếm.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow-md rounded-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Thông tin
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          {user.avatar ? (
                            <img
                              className="w-10 h-10 rounded-full"
                              src={user.avatar}
                              alt={user.name}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.phone || "Chưa có số điện thoại"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tham gia: {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        {user.role === "seller" &&
                          !user.isApproved &&
                          !user.isBanned && (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowApproveModal(true);
                              }}
                              className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                            >
                              Duyệt
                            </button>
                          )}
                        {!user.isBanned && user.role !== "admin" && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowBanModal(true);
                            }}
                            className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                          >
                            Khóa
                          </button>
                        )}
                        {user.isBanned && user.role !== "admin" && (
                          <button
                            onClick={() => {
                              // Unban functionality can be added here
                            }}
                            className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            disabled
                          >
                            Mở khóa
                          </button>
                        )}
                        <button
                          onClick={() => {
                            // View details functionality can be added here
                          }}
                          className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                        >
                          Xem
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Hiển thị {users.length} người dùng
              </div>
              {/* Pagination can be added here */}
            </div>
          </div>
        </div>
      )}

      {/* Approve Seller Modal */}
      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleApprove}
        title="Duyệt Người bán"
        message={`Bạn có chắc chắn muốn duyệt người bán "${selectedUser?.name}"? Người này sẽ có quyền đăng sản phẩm lên sàn.`}
        confirmText="Duyệt"
        type="info"
        isLoading={loading}
      />

      {/* Ban User Modal */}
      <ConfirmModal
        isOpen={showBanModal}
        onClose={() => {
          setShowBanModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleBan}
        title="Khóa Tài khoản"
        message={`Bạn có chắc chắn muốn khóa tài khoản của "${selectedUser?.name}"? Người này sẽ không thể đăng nhập vào hệ thống.`}
        confirmText="Khóa"
        type="danger"
        isLoading={loading}
      />
    </div>
  );
};

export default UserList;
