// src/hooks/useProducts.js
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  // ✅ Lấy user info từ localStorage
  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      return userData ? { ...JSON.parse(userData), token } : null;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  };

  // ✅ Chuẩn hóa product data
  const normalizeProduct = (product) => ({
    ...product,
    id: product._id || product.id,
    stock: product.stock || 0,
    sales: product.sales || 0,
    status: product.status || "active",
    images: product.images || [],
    videos: product.videos || [],
    price: product.price || 0,
    category: product.category || "",
    description: product.description || "",
  });

  // ✅ Lấy sản phẩm của seller - ĐÚNG
  const fetchMyProducts = async () => {
    const user = getUserInfo();

    if (!user || user.role !== "seller") {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/seller/products`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const productsData = data.data || data || [];
      const processedProducts = productsData.map(normalizeProduct);

      setProducts(processedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Thêm sản phẩm mới - ĐÃ SỬA LOGIC THƯƠNG HIỆU
  const addProduct = async (productData) => {
    setOperationLoading(true);
    try {
      const user = getUserInfo();
      if (!user || user.role !== "seller") {
        return { success: false, message: "Bạn không có quyền thêm sản phẩm" };
      }

      const formData = new FormData();

      // Thêm các field thông tin cơ bản
      formData.append("name", productData.name);
      formData.append("description", productData.description || "");
      formData.append("price", productData.price.toString());
      formData.append("category", productData.category);
      formData.append("stock", productData.stock.toString());
      formData.append("status", productData.status || "active");

      // 🛠️ SỬA QUAN TRỌNG: Xử lý Thương hiệu (Brand)
      // Nếu có nhập thì gửi brandName, nếu không thì gửi "No Brand"
      if (productData.brand && productData.brand.trim() !== "") {
        formData.append("brandName", productData.brand.trim());
      } else {
        formData.append("brandName", "No Brand");
      }

      // Thêm các optional fields khác
      if (productData.slug) formData.append("slug", productData.slug);
      if (productData.sku) formData.append("sku", productData.sku);
      if (productData.warranty)
        formData.append("warranty", productData.warranty);

      // Thêm ảnh (nhiều file)
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          }
        });
      }

      // Thêm video (nhiều file)
      if (productData.videos && productData.videos.length > 0) {
        productData.videos.forEach((video) => {
          if (video instanceof File) {
            formData.append("videos", video);
          }
        });
      }

      console.log(
        "📤 Sending product data to:",
        `${API_BASE}/api/seller/products`
      );

      const res = await fetch(`${API_BASE}/api/seller/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("📡 Add product response:", data);

      if (res.ok) {
        const newProduct = normalizeProduct(data.data || data.product || data);
        setProducts((prev) => [newProduct, ...prev]);
        return {
          success: true,
          message: data.message || "✅ Thêm sản phẩm thành công!",
          data: newProduct,
        };
      } else {
        return {
          success: false,
          message: data.message || "❌ Không thể thêm sản phẩm",
        };
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      return {
        success: false,
        message: "❌ Không thể kết nối server.",
      };
    } finally {
      setOperationLoading(false);
    }
  };

  // ✅ Cập nhật sản phẩm - SỬA ENDPOINT
  const updateProduct = async (productId, updateData) => {
    setOperationLoading(true);
    try {
      const user = getUserInfo();
      if (!user || user.role !== "seller") {
        return {
          success: false,
          message: "Bạn không có quyền cập nhật sản phẩm",
        };
      }

      // Kiểm tra nếu có file media mới thì dùng FormData, không thì dùng JSON
      const hasNewMedia =
        (updateData.images &&
          updateData.images.some((img) => img instanceof File)) ||
        (updateData.videos &&
          updateData.videos.some((vid) => vid instanceof File));

      let body;
      let headers = {
        Authorization: `Bearer ${user.token}`,
      };

      if (hasNewMedia) {
        // Dùng FormData cho media mới
        const formData = new FormData();
        Object.keys(updateData).forEach((key) => {
          if (key === "images" || key === "videos") {
            // Chỉ append file mới
            updateData[key].forEach((file) => {
              if (file instanceof File) {
                formData.append(key, file);
              }
            });
          } else {
            // Append các field khác
            if (updateData[key] !== undefined && updateData[key] !== null) {
              formData.append(key, updateData[key]);
            }
          }
        });
        body = formData;
      } else {
        // Dùng JSON cho update thông thường
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(updateData);
      }

      // ❌ CŨ: /api/products/:id (public route)
      // ✅ MỚI: /api/seller/products/:id (seller route)
      const res = await fetch(`${API_BASE}/api/seller/products/${productId}`, {
        // ĐÃ SỬA
        method: "PUT",
        headers,
        body,
      });

      const data = await res.json();

      if (res.ok) {
        const updatedProduct = normalizeProduct(
          data.data || data.product || data
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? updatedProduct : p))
        );
        return {
          success: true,
          message: data.message || "✅ Cập nhật sản phẩm thành công!",
          data: updatedProduct,
        };
      } else {
        return {
          success: false,
          message: data.message || "❌ Không thể cập nhật sản phẩm",
        };
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      return { success: false, message: "❌ Không thể kết nối server." };
    } finally {
      setOperationLoading(false);
    }
  };

  // ✅ Xóa sản phẩm - SỬA ENDPOINT
  const deleteProduct = async (productId) => {
    setOperationLoading(true);
    try {
      const user = getUserInfo();
      if (!user || user.role !== "seller") {
        return { success: false, message: "Bạn không có quyền xóa sản phẩm" };
      }

      // ❌ CŨ: /api/products/:id (public route)
      // ✅ MỚI: /api/seller/products/:id (seller route)
      const res = await fetch(`${API_BASE}/api/seller/products/${productId}`, {
        // ĐÃ SỬA
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        return {
          success: true,
          message: data.message || "✅ Xóa sản phẩm thành công!",
        };
      } else {
        return {
          success: false,
          message: data.message || "❌ Không thể xóa sản phẩm",
        };
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      return { success: false, message: "❌ Không thể kết nối server." };
    } finally {
      setOperationLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  return {
    products,
    loading,
    operationLoading,
    fetchProducts: fetchMyProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setProducts,
  };
};
