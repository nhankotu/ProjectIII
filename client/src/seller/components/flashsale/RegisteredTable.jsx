import React, { useState, useMemo } from "react";
import { Filter, Zap, Timer, CheckCircle } from "lucide-react";
import { EventStatusBadge } from "./FlashSaleComponents";

const RegisteredTable = ({ registrations }) => {
  const [filterStatus, setFilterStatus] = useState("all");

  // Logic lọc nằm gọn trong component này
  const filteredData = useMemo(() => {
    if (filterStatus === "all") return registrations;
    return registrations.filter((item) => item.eventStatus === filterStatus);
  }, [registrations, filterStatus]);

  const filters = [
    { id: "all", label: "Tất cả", icon: <Filter size={14} /> },
    {
      id: "happening",
      label: "Đang diễn ra",
      icon: <Zap size={14} />,
      activeClass: "bg-red-100 text-red-700 border-red-200",
    },
    {
      id: "upcoming",
      label: "Sắp diễn ra",
      icon: <Timer size={14} />,
      activeClass: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: "ended",
      label: "Đã kết thúc",
      icon: <CheckCircle size={14} />,
      activeClass: "bg-gray-100 text-gray-700 border-gray-200",
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {filters.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterStatus(btn.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center gap-1.5 transition-colors
            ${
              filterStatus === btn.id
                ? btn.activeClass || "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {btn.icon} {btn.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4">Sản phẩm</th>
              <th className="p-4">Thông tin sự kiện</th>
              <th className="p-4 text-right">Chi tiết giá</th>
              <th className="p-4 text-center">SL Đăng ký</th>
              <th className="p-4 text-center">Trạng thái duyệt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-10 text-center text-gray-400 italic"
                >
                  {filterStatus === "all"
                    ? "Chưa có sản phẩm nào đăng ký Flash Sale."
                    : "Không tìm thấy sản phẩm nào ở trạng thái này."}
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage || "https://placehold.co/40"}
                        className="w-12 h-12 object-cover rounded border"
                        alt=""
                      />
                      <div>
                        <span
                          className="font-medium text-gray-800 line-clamp-1 max-w-[200px]"
                          title={item.productName}
                        >
                          {item.productName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-800">
                        {item.flashSaleTitle}
                      </span>
                      <div className="flex items-center gap-2">
                        <EventStatusBadge status={item.eventStatus} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(item.startTime).toLocaleDateString("vi-VN")} •{" "}
                        {new Date(item.startTime).getHours()}h -{" "}
                        {new Date(item.endTime).getHours()}h
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-bold text-red-600 text-base">
                      {Number(item.salePrice).toLocaleString()}đ
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="font-medium">{item.limitQuantity}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Đã bán: {item.soldQuantity || 0}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase inline-block min-w-[80px] border
                      ${
                        item.status === "approved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : item.status === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {item.status === "pending"
                        ? "Chờ duyệt"
                        : item.status === "approved"
                          ? "Đã duyệt"
                          : "Từ chối"}
                    </span>
                    {item.rejectReason && (
                      <div className="text-[10px] text-red-500 mt-1 max-w-[120px] mx-auto leading-tight bg-red-50 p-1 rounded">
                        Lý do: {item.rejectReason}
                      </div>
                    )}
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

export default RegisteredTable;
