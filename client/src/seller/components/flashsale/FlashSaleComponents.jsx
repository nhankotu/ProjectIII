import React from "react";
import {
  Zap,
  Timer,
  CheckCircle,
  ShoppingBag,
  Calendar,
  Clock,
} from "lucide-react";

// --- SUB-COMPONENT 1: Badge trạng thái (Dùng cho Table) ---
export const EventStatusBadge = ({ status }) => {
  switch (status) {
    case "happening":
      return (
        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 animate-pulse">
          <Zap size={12} fill="currentColor" /> ĐANG DIỄN RA
        </span>
      );
    case "upcoming":
      return (
        <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
          <Timer size={12} /> SẮP DIỄN RA
        </span>
      );
    case "ended":
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
          <CheckCircle size={12} /> ĐÃ KẾT THÚC
        </span>
      );
    default:
      return null;
  }
};

// --- SUB-COMPONENT 2: Grid sự kiện đang mở (Dùng cho Tab 1) ---
export const AvailableEventsGrid = ({ events, onRegister }) => {
  if (events.length === 0) {
    return (
      <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
        <ShoppingBag className="mx-auto text-gray-300 mb-3" size={48} />
        <p className="text-gray-500">
          Hiện không có chương trình Flash Sale nào đang mở đăng ký.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
      {events.map((event) => (
        <div
          key={event._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
        >
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500 relative flex items-center justify-center overflow-hidden">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <ShoppingBag className="text-white/30 w-16 h-16" />
            )}
            <div className="absolute top-2 right-2 bg-white/90 text-red-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
              Mở đăng ký
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3
              className="font-bold text-lg text-gray-800 mb-2 line-clamp-1"
              title={event.title}
            >
              {event.title}
            </h3>

            <div className="space-y-3 mb-5 flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <Calendar size={16} className="text-red-500" />
                <span>
                  {new Date(event.startTime).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <Clock size={16} className="text-red-500" />
                <span className="font-medium">
                  {new Date(event.startTime).getHours()}h -{" "}
                  {new Date(event.endTime).getHours()}h
                </span>
              </div>
            </div>

            <button
              onClick={() => onRegister(event._id)}
              className="w-full py-2.5 rounded-lg border border-red-600 text-red-600 font-semibold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
            >
              Tham gia ngay
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
