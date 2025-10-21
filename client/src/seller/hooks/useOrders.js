import { useState, useEffect } from "react";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock data
      const mockOrders = [
        {
          id: "ORD-001",
          customer: {
            name: "Nguyễn Văn A",
            phone: "0123456789",
            email: "a@email.com",
          },
          items: [
            {
              product: "Áo thun nam",
              price: 150000,
              quantity: 2,
              total: 300000,
            },
            {
              product: "Quần jeans",
              price: 350000,
              quantity: 1,
              total: 350000,
            },
          ],
          total: 650000,
          status: "pending",
          paymentMethod: "cod",
          shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
          createdAt: "2024-10-01 10:30:00",
          updatedAt: "2024-10-01 10:30:00",
        },
        {
          id: "ORD-002",
          customer: {
            name: "Trần Thị B",
            phone: "0987654321",
            email: "b@email.com",
          },
          items: [
            {
              product: "Giày thể thao",
              price: 420000,
              quantity: 1,
              total: 420000,
            },
          ],
          total: 420000,
          status: "confirmed",
          paymentMethod: "momo",
          shippingAddress: "456 Đường XYZ, Quận 2, TP.HCM",
          createdAt: "2024-10-01 09:15:00",
          updatedAt: "2024-10-01 11:20:00",
        },
        {
          id: "ORD-003",
          customer: {
            name: "Lê Văn C",
            phone: "0369852147",
            email: "c@email.com",
          },
          items: [
            {
              product: "Túi xách da",
              price: 280000,
              quantity: 1,
              total: 280000,
            },
            { product: "Ví nam", price: 120000, quantity: 1, total: 120000 },
          ],
          total: 400000,
          status: "shipping",
          paymentMethod: "banking",
          shippingAddress: "789 Đường DEF, Quận 3, TP.HCM",
          createdAt: "2024-09-30 14:20:00",
          updatedAt: "2024-10-01 08:45:00",
        },
        {
          id: "ORD-004",
          customer: {
            name: "Phạm Thị D",
            phone: "0912345678",
            email: "d@email.com",
          },
          items: [
            {
              product: "Áo khoác nữ",
              price: 520000,
              quantity: 1,
              total: 520000,
            },
          ],
          total: 520000,
          status: "completed",
          paymentMethod: "cod",
          shippingAddress: "321 Đường GHI, Quận 4, TP.HCM",
          createdAt: "2024-09-29 16:45:00",
          updatedAt: "2024-09-30 10:30:00",
        },
        {
          id: "ORD-005",
          customer: {
            name: "Hoàng Văn E",
            phone: "0945678912",
            email: "e@email.com",
          },
          items: [
            {
              product: "Quần short",
              price: 180000,
              quantity: 3,
              total: 540000,
            },
          ],
          total: 540000,
          status: "cancelled",
          paymentMethod: "momo",
          shippingAddress: "654 Đường JKL, Quận 5, TP.HCM",
          createdAt: "2024-09-28 11:20:00",
          updatedAt: "2024-09-28 15:10:00",
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toLocaleString("vi-VN"),
            }
          : order
      )
    );
  };

  const getOrdersByStatus = (status) => {
    if (status === "all") return orders;
    return orders.filter((order) => order.status === status);
  };

  return {
    orders,
    loading,
    updateOrderStatus,
    getOrdersByStatus,
    refetch: fetchOrders,
  };
};
