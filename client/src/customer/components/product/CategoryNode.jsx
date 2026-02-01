import React, { useState } from "react";
import { ChevronDown, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CategoryNode = ({ node, depth = 0 }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const handleItemClick = (e) => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      navigate(`/products/${node.slug}`);
    }
  };
  // Render cấp 0 (Danh mục gốc) như các Card lớn
  if (depth === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
        <div
          className="relative h-48 cursor-pointer group"
          onClick={() => {
            if (hasChildren) {
              setIsOpen(!isOpen);
            } else {
              navigate(`/products/${node.slug}`);
            }
          }}
        >
          <img
            src={node.image || "https://via.placeholder.com/400x200"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={node.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-4 text-white">
            <h2 className="text-xl font-black uppercase tracking-wide">
              {node.name}
            </h2>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-200 opacity-90">
                {hasChildren
                  ? `${node.children.length} danh mục con`
                  : `${node.productCount} sản phẩm`}
              </p>
              {hasChildren && (
                <div
                  className={`p-1 bg-white/20 rounded-full transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  <ChevronDown size={18} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nội dung bên trong khi mở rộng */}
        {hasChildren && isOpen && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
            {node.children.map((child) => (
              <CategoryNode key={child._id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render cấp 1 trở đi (Danh mục con) như các Item nhỏ hơn
  return (
    <div className="flex flex-col">
      <div
        onClick={handleItemClick} // Gán sự kiện click cho toàn bộ hàng
        className={`flex items-center justify-between p-4 bg-white rounded-2xl border transition-all cursor-pointer group ${
          hasChildren
            ? "border-gray-200/60 hover:border-blue-300"
            : "border-transparent hover:bg-blue-50/50 hover:border-blue-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
            {node.image ? (
              <img src={node.image} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm uppercase">{node.name[0]}</span>
            )}
          </div>
          <div>
            <h4
              className={`text-sm font-bold transition-colors ${
                hasChildren
                  ? "text-gray-800"
                  : "text-gray-700 group-hover:text-blue-600"
              }`}
            >
              {node.name}
            </h4>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
              {node.productCount} sản phẩm
            </span>
          </div>
        </div>
      </div>

      {/* Hiển thị danh mục con đệ quy */}
      {hasChildren && isOpen && (
        <div className="ml-6 mt-2 pl-4 border-l-2 border-blue-100 space-y-2 animate-in slide-in-from-top-2 duration-300">
          {node.children.map((child) => (
            <CategoryNode key={child._id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryNode;
