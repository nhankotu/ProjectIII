// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import Users from "../admin/pages/Users";
import Products from "../admin/pages/Products";
import Orders from "../admin/pages/Orders";
import Statistics from "../admin/pages/Statistics";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
