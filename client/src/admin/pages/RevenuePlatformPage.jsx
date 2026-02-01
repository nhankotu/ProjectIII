import React, { useState } from "react";
import { usePlatformRevenue } from "../hooks/useAdminRevenue";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DollarSign, ShoppingBag, Percent, TrendingUp } from "lucide-react";

const RevenuePlatformPage = () => {
  const [range, setRange] = useState("month");
  const { data, loading } = usePlatformRevenue(range);

  if (loading || !data)
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  const { stats, revenueReport, payments } = data;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Thống kê Tài chính Sàn</h1>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border p-2 rounded-lg bg-white shadow-sm outline-none"
        >
          <option value="day">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm nay</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Tổng GMV"
          value={stats.totalGmv}
          icon={<DollarSign className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Phí sàn (5%)"
          value={stats.platformProfit}
          icon={<Percent className="text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Tổng đơn hàng"
          // 🔥 SỬA: stats.orders -> stats.totalOrders
          value={stats.totalOrders}
          icon={<ShoppingBag className="text-orange-600" />}
          color="bg-orange-50"
          isCurrency={false}
        />
        <StatCard
          title="Trung bình đơn"
          // 🔥 SỬA: Tự tính nếu BE không trả về trực tiếp
          value={
            stats.totalOrders > 0
              ? Math.round(stats.totalGmv / stats.totalOrders)
              : 0
          }
          icon={<TrendingUp className="text-purple-600" />}
          color="bg-purple-50"
        />
      </div>
      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold mb-6">Doanh thu theo thời gian</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueReport.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(val) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(val)
                }
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-bold">Giao dịch thành công gần đây</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4">Mã đơn</th>
              <th className="p-4">Shop</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Giá trị</th>
              <th className="p-4">Phí sàn</th>
              <th className="p-4">Ngày giao</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-xs font-bold">{p.id}</td>
                <td className="p-4">{p.shop}</td>
                <td className="p-4 text-gray-600">{p.customer}</td>
                <td className="p-4 font-bold">
                  {new Intl.NumberFormat("vi-VN").format(p.amount)}đ
                </td>
                <td className="p-4 text-green-600 font-medium">
                  {/* 🔥 SỬA: p.fee -> p.platformFeeEarned */}+
                  {new Intl.NumberFormat("vi-VN").format(p.platformFeeEarned)}đ
                </td>
                <td className="p-4 text-gray-400 text-sm">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-component StatCard
const StatCard = ({ title, value, icon, color, isCurrency = true }) => (
  <div className={`p-6 rounded-2xl ${color} flex items-center gap-4`}>
    <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-xl font-bold">
        {isCurrency
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value)
          : value}
      </p>
    </div>
  </div>
);

export default RevenuePlatformPage;
