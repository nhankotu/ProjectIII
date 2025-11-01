import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

const OrdersTab = ({ orders }) => {
  const getStatusBadge = (status) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      shipping: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={variants[status]}>
        {status === "completed"
          ? "Hoàn thành"
          : status === "shipping"
          ? "Đang giao"
          : "Đã hủy"}
      </Badge>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Lịch sử đơn hàng</h3>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">#{order.id}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                    <p className="text-sm">{order.items} sản phẩm</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{order.total}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
