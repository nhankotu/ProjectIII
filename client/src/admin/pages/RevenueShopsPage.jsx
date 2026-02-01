import React, { useState } from "react";
import { useShopsRevenue } from "../hooks/useAdminRevenue";
import { Store, ArrowUpRight } from "lucide-react";

const RevenueShopsPage = () => {
  const [range, setRange] = useState("month");
  const { shops, loading } = useShopsRevenue(range);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doanh thu theo Đối tác</h1>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border p-2 rounded-lg bg-white shadow-sm"
        >
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm nay</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4">Thứ hạng</th>
              <th className="p-4">Cửa hàng</th>
              <th className="p-4">Số đơn</th>
              <th className="p-4">Doanh thu hàng</th>
              <th className="p-4">Phí sàn (5%)</th>
              <th className="p-4">Thực nhận (Payout)</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-400">
                  Đang tính toán dữ liệu...
                </td>
              </tr>
            ) : (
              shops.map((shop, index) => (
                <tr key={shop._id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-400">#{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border flex items-center justify-center shrink-0">
                        {/* 🔥 SỬA: Dùng shopAvatar thay vì avatar */}
                        {shop.shopAvatar ? (
                          <img
                            src={shop.shopAvatar}
                            alt={shop.shopName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <Store className="text-gray-400" size={20} />
                        )}
                      </div>
                      <span className="font-bold text-gray-800">
                        {shop.shopName}
                      </span>
                    </div>
                  </td>
                  {/* 🔥 SỬA: Dùng totalOrders */}
                  <td className="p-4">{shop.totalOrders} đơn</td>

                  {/* 🔥 SỬA: Dùng grossRevenue */}
                  <td className="p-4 font-bold text-blue-600">
                    {new Intl.NumberFormat("vi-VN").format(shop.grossRevenue)}đ
                  </td>

                  <td className="p-4 font-bold text-orange-600">
                    -{new Intl.NumberFormat("vi-VN").format(shop.platformFee)}đ
                  </td>

                  {/* 🔥 BỔ SUNG: Hiển thị Net Payout (Số tiền sàn trả cho shop) */}
                  <td className="p-4 font-bold text-green-600">
                    {new Intl.NumberFormat("vi-VN").format(shop.netPayout)}đ
                  </td>

                  <td className="p-4">
                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      Chi tiết <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueShopsPage;
