import React, { useState, useEffect } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
    videos: [],
  });
  const [message, setMessage] = useState("");

  // 🧩 Lấy danh sách sản phẩm từ backend
  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // ➕ Gửi yêu cầu thêm sản phẩm
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          images: newProduct.images,
          videos: newProduct.videos,
        }),
      });

      const data = await res.json();
      setMessage(data.message);

      // Làm mới danh sách
      const updatedList = await fetch("/api/admin/products").then((r) =>
        r.json()
      );
      setProducts(updatedList);

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        images: [],
        videos: [],
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi khi thêm sản phẩm");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛍️ Quản lý sản phẩm</h1>

      {/* Form thêm sản phẩm */}
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <h3 className="font-semibold mb-2">Thêm sản phẩm mới</h3>

        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
        />

        <textarea
          placeholder="Mô tả"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
        />

        <input
          type="number"
          placeholder="Giá (VNĐ)"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Thêm
        </button>

        {message && <p className="mt-3 text-green-600">{message}</p>}
      </form>

      {/* Danh sách sản phẩm */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Danh sách sản phẩm</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Tên</th>
              <th className="border px-2 py-1">Giá</th>
              <th className="border px-2 py-1">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td className="border px-2 py-1">{p.name}</td>
                <td className="border px-2 py-1">
                  {p.price.toLocaleString()} ₫
                </td>
                <td className="border px-2 py-1">
                  {new Date(p.createdAt).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
