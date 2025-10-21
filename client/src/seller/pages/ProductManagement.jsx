// src/seller/pages/ProductManagement.jsx
import React, { useState, useEffect } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [],
    videos: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Mock data với hình ảnh
      const mockProducts = [
        {
          id: 1,
          name: "Áo thun nam cổ tròn",
          price: 150000,
          stock: 45,
          category: "Thời trang",
          status: "active",
          sales: 23,
          images: [
            "https://via.placeholder.com/300x300?text=Áo+Thun+1",
            "https://via.placeholder.com/300x300?text=Áo+Thun+2",
          ],
          videos: [],
          description: "Áo thun nam chất liệu cotton mềm mại",
          createdAt: "2024-09-15",
        },
        {
          id: 2,
          name: "Quần jeans nữ",
          price: 350000,
          stock: 12,
          category: "Thời trang",
          status: "active",
          sales: 15,
          images: ["https://via.placeholder.com/300x300?text=Quần+Jeans"],
          videos: ["https://www.example.com/video/jeans-preview.mp4"],
          description: "Quần jeans nữ form slim fit",
          createdAt: "2024-09-20",
        },
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chọn hình ảnh
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...imageUrls]);

    // Trong thực tế, bạn sẽ upload lên server và lấy URL
    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  // Xử lý chọn video
  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    const videoUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedVideos((prev) => [...prev, ...videoUrls]);

    setNewProduct((prev) => ({
      ...prev,
      videos: [...prev.videos, ...videoUrls],
    }));
  };

  // Xóa hình ảnh
  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    setNewProduct((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  // Xóa video
  const removeVideo = (index) => {
    const newVideos = [...selectedVideos];
    newVideos.splice(index, 1);
    setSelectedVideos(newVideos);
    setNewProduct((prev) => ({
      ...prev,
      videos: newVideos,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const product = {
      id: products.length + 1,
      ...newProduct,
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: "active",
      sales: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProducts([product, ...products]);
    setShowAddModal(false);
    resetForm();
    alert("Thêm sản phẩm thành công!");
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      description: product.description,
      images: product.images,
      videos: product.videos,
    });
    setSelectedImages(product.images);
    setSelectedVideos(product.videos);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...editingProduct,
      ...newProduct,
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock),
    };

    setProducts(
      products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
    );
    setShowEditModal(false);
    resetForm();
    alert("Cập nhật sản phẩm thành công!");
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      images: [],
      videos: [],
    });
    setSelectedImages([]);
    setSelectedVideos([]);
    setEditingProduct(null);
  };

  const handleUpdateStock = async (productId, newStock) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const handleUpdateStatus = async (productId, newStatus) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, status: newStatus } : p
      )
    );
  };

  const getStatusBadge = (status, stock) => {
    const actualStatus =
      stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : status;

    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Đang bán" },
      inactive: { color: "bg-gray-100 text-gray-800", text: "Ngừng bán" },
      out_of_stock: { color: "bg-red-100 text-red-800", text: "Hết hàng" },
      low_stock: { color: "bg-yellow-100 text-yellow-800", text: "Sắp hết" },
    };

    const config = statusConfig[actualStatus] || statusConfig.active;
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const ProductForm = ({ isEditing = false, onSubmit }) => (
    <form
      onSubmit={onSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên sản phẩm *
        </label>
        <input
          type="text"
          required
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Nhập tên sản phẩm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá (VNĐ) *
          </label>
          <input
            type="number"
            required
            min="0"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng *
          </label>
          <input
            type="number"
            required
            min="0"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Danh mục *
        </label>
        <select
          required
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Chọn danh mục</option>
          <option value="Thời trang">Thời trang</option>
          <option value="Giày dép">Giày dép</option>
          <option value="Phụ kiện">Phụ kiện</option>
          <option value="Điện tử">Điện tử</option>
          <option value="Nhà cửa">Nhà cửa</option>
        </select>
      </div>

      {/* Upload Hình ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hình ảnh sản phẩm
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm text-gray-600">Click để chọn hình ảnh</p>
            <p className="text-xs text-gray-500">
              Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)
            </p>
          </label>
        </div>

        {/* Hiển thị hình ảnh đã chọn */}
        {selectedImages.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Hình ảnh đã chọn:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Video sản phẩm
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoSelect}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload" className="cursor-pointer">
            <div className="text-2xl mb-2">🎥</div>
            <p className="text-sm text-gray-600">Click để chọn video</p>
            <p className="text-xs text-gray-500">
              Hỗ trợ: MP4, MOV (tối đa 50MB)
            </p>
          </label>
        </div>

        {/* Hiển thị video đã chọn */}
        {selectedVideos.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Video đã chọn:
            </p>
            <div className="space-y-2">
              {selectedVideos.map((video, index) => (
                <div key={index} className="relative bg-gray-100 p-2 rounded">
                  <video controls className="w-full rounded">
                    <source src={video} type="video/mp4" />
                    Trình duyệt không hỗ trợ video.
                  </video>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả sản phẩm
        </label>
        <textarea
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="4"
          placeholder="Mô tả chi tiết về sản phẩm..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => {
            isEditing ? setShowEditModal(false) : setShowAddModal(false);
            resetForm();
          }}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {isEditing ? "Cập nhật" : "Thêm sản phẩm"}
        </button>
      </div>
    </form>
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải sản phẩm...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
        <p className="text-gray-600">Tổng số: {products.length} sản phẩm</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
                <option value="out_of_stock">Hết hàng</option>
                <option value="low_stock">Sắp hết</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 whitespace-nowrap"
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đã bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh/Video
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded object-cover"
                        src={
                          product.images[0] || "https://via.placeholder.com/60"
                        }
                        alt={product.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) =>
                        handleUpdateStock(product.id, parseInt(e.target.value))
                      }
                      className="w-20 p-1 border border-gray-300 rounded text-sm"
                      min="0"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sales}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {product.images.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          📷 {product.images.length}
                        </span>
                      )}
                      {product.videos.length > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          🎥 {product.videos.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status, product.stock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            product.id,
                            product.status === "active" ? "inactive" : "active"
                          )
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        {product.status === "active" ? "Ẩn" : "Hiện"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy sản phẩm nào
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Thêm sản phẩm mới</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ProductForm onSubmit={handleAddProduct} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Sửa sản phẩm</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ProductForm isEditing={true} onSubmit={handleUpdateProduct} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
