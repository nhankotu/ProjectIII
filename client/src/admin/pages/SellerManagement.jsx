// src/admin/pages/SellerManagement.jsx
import React, { useState, useEffect } from "react";

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/sellers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSellers(data.sellers);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSeller = async (sellerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/sellers/${sellerId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchSellers();
        alert("Đã duyệt seller thành công!");
      }
    } catch (error) {
      console.error("Error approving seller:", error);
    }
  };

  const handleRejectSeller = async (sellerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/sellers/${sellerId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchSellers();
        alert("Đã từ chối seller!");
      }
    } catch (error) {
      console.error("Error rejecting seller:", error);
    }
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Chờ duyệt" },
      approved: { color: "bg-green-100 text-green-800", text: "Đã duyệt" },
      rejected: { color: "bg-red-100 text-red-800", text: "Đã từ chối" },
      suspended: { color: "bg-gray-100 text-gray-800", text: "Tạm ngưng" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Người Bán</h1>
        <p className="text-gray-600">Duyệt và quản lý tài khoản seller</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-blue-600">
            {sellers.length}
          </div>
          <div className="text-sm text-gray-600">Tổng số seller</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-600">
            {sellers.filter((s) => s.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600">Chờ duyệt</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-green-600">
            {sellers.filter((s) => s.status === "approved").length}
          </div>
          <div className="text-sm text-gray-600">Đã duyệt</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-red-600">
            {sellers.filter((s) => s.status === "suspended").length}
          </div>
          <div className="text-sm text-gray-600">Bị khóa</div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {seller.shopName
                          ? seller.shopName[0].toUpperCase()
                          : "S"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {seller.shopName || "Chưa đặt tên"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {seller.shopCategory || "Chưa phân loại"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {seller.userId?.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {seller.userId?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(seller.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seller.productCount || 0} sản phẩm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ⭐ {seller.rating || "Chưa có"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(seller)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Chi tiết
                      </button>

                      {seller.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveSeller(seller._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleRejectSeller(seller._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Từ chối
                          </button>
                        </>
                      )}

                      {seller.status === "approved" && (
                        <button
                          onClick={() => handleRejectSeller(seller._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Khóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Chi tiết Shop</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên shop
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSeller.shopName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả shop
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSeller.shopDescription || "Chưa có mô tả"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSeller.address || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSeller.phone || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày đăng ký
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedSeller.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManagement;
