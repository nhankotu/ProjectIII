import React from "react";
import { Link } from "react-router-dom";

const categories = [
  "Thời Trang Nam",
  "Thời Trang Nữ",
  "Điện Thoại & Phụ Kiện",
  "Mẹ & Bé",
  "Thiết Bị Điện Tử",
  "Nhà Cửa & Đời Sống",
  "Máy Tính & Laptop",
  "Sắc Đẹp",
  "Máy Ảnh & Máy Quay Phim",
  "Sức Khỏe",
  "Đồng Hồ",
  "Giày Dép Nữ",
  "Giày Dép Nam",
  "Túi Ví Nữ",
  "Thiết Bị Điện Gia Dụng",
  "Phụ Kiện & Trang Sức Nữ",
  "Thể Thao & Du Lịch",
  "Bách Hóa Online",
  "Ô Tô & Xe Máy & Xe Đạp",
];

function CategoryList() {
  return (
    <div>
      <h2>Danh Mục Sản Phẩm</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            {/* Sử dụng Link để điều hướng đến trang chi tiết danh mục */}
            <Link to={`/category/${category}`}>{category}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
