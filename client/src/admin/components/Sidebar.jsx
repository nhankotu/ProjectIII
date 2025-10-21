import React from "react";
import { LayoutDashboard, Package, Users } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-4">
        <a href="#" className="flex items-center gap-2 hover:text-blue-600">
          <LayoutDashboard size={20} /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-blue-600">
          <Package size={20} /> Products
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-blue-600">
          <Users size={20} /> Users
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
