const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Helper function để xử lý response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

export const userService = {
  // Lấy thông tin user profile
  async getProfile() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Cập nhật thông tin user
  async updateProfile(profileData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Upload avatar
  async uploadAvatar(file) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },
};

export const orderService = {
  // Lấy danh sách đơn hàng
  async getOrders() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Lấy chi tiết đơn hàng
  async getOrderDetail(orderId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },
};

export const addressService = {
  // Lấy danh sách địa chỉ
  async getAddresses() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/addresses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // Thêm địa chỉ mới
  async addAddress(addressData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/addresses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    });
    return handleResponse(response);
  },

  // Cập nhật địa chỉ
  async updateAddress(addressId, addressData) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/users/addresses/${addressId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      }
    );
    return handleResponse(response);
  },

  // Xóa địa chỉ
  async deleteAddress(addressId) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/users/addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  // Đặt địa chỉ mặc định
  async setDefaultAddress(addressId) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/users/addresses/${addressId}/default`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },
};
