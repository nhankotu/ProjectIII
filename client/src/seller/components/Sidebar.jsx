import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, ShoppingCart, User, BarChart } from "lucide-react";

const Sidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", icon: <BarChart size={18} />, path: "/" },
    { name: "Sản phẩm", icon: <Package size={18} />, path: "/products" },
    { name: "Đơn hàng", icon: <ShoppingCart size={18} />, path: "/orders" },
    { name: "Hồ sơ", icon: <User size={18} />, path: "/profile" },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-sm">
      <div className="p-4 text-2xl font-bold text-blue-600">Seller</div>
      <ul>
        {menu.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
                pathname === item.path
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-blue-50 text-gray-700"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
