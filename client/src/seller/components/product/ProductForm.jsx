import React, { useState, useEffect } from "react";
import MediaUpload from "./MediaUpload";
import { useProducts } from "../../hooks/useProducts";
import { FaTrash, FaPlus, FaBox, FaTruck, FaTimes } from "react-icons/fa";

const ProductForm = ({ product, onSubmit, isEditing, onCancel }) => {
  // ================= STATE QUẢN LÝ DỮ LIỆU =================
  const { getCategories } = useProducts();
  // 1. Thông tin cơ bản & Vận chuyển
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    originalPrice: "",
    stock: "",
    type: "simple", // 'simple' hoặc 'variable'
    shipping: { weight: 500, height: 10, length: 10, width: 10 },
  });

  // 2. Quản lý Biến thể (Advanced)
  // 'attributes' lưu định nghĩa (VD: Màu [Đỏ, Xanh]) -> Dùng để sinh variants
  const [attributes, setAttributes] = useState([]);
  // 'variants' lưu danh sách SKU thực tế sẽ gửi lên server
  const [variants, setVariants] = useState([]);

  // 3. Quản lý Ảnh (Logic phức tạp nhất)
  // 'previewImages': Dùng để hiển thị lên UI (chứa cả URL ảnh cũ và blob ảnh mới)
  const [previewImages, setPreviewImages] = useState([]);
  // 'newImageFiles': Mảng File[] để upload lên Cloudinary
  const [newImageFiles, setNewImageFiles] = useState([]);
  // 'deletedImageIds': Mảng public_id ảnh cũ cần xóa
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  //video
  const [previewVideos, setPreviewVideos] = useState([]); // URL hiển thị
  const [newVideoFiles, setNewVideoFiles] = useState([]); // File upload l
  // 4. Các State bổ trợ
  const [specifications, setSpecifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // ================= 1. KHỞI TẠO DỮ LIỆU (KHI EDIT) =================
  useEffect(() => {
    // 1.1 Gọi hàm từ Hook để lấy danh mục
    const fetchCats = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCats();

    // 1.2 Fill dữ liệu nếu đang sửa
    if (product && isEditing) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category?._id || product.category || "",
        brand: product.brand?.name || product.brand || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        stock: product.stock || "",
        type: product.type || "simple",
        shipping: product.shipping || {
          weight: 500,
          height: 10,
          length: 10,
          width: 10,
        },
      });

      // Load Variants & Attributes
      setVariants(product.variants || []);
      setAttributes(product.variantAttributes || []);
      setSpecifications(product.specifications || []);

      // Load Images: Đánh dấu là ảnh cũ (isOld: true)
      if (product.images && product.images.length > 0) {
        setPreviewImages(
          product.images.map((img) => ({
            url: img.url,
            public_id: img.public_id,
            isOld: true,
          })),
        );
      }
      // 👇 THÊM MỚI: Load Video (nếu có)
      // Giả sử backend trả về object 'video' hoặc mảng 'videos'
      // Kiểm tra cấu trúc product của bạn, thường là product.video (object) hoặc product.videos (array)
      if (product.video) {
        setPreviewVideos([
          {
            url: product.video.url,
            public_id: product.video.public_id,
            isOld: true,
          },
        ]);
      }
    }
  }, [product, isEditing]);

  // ================= 2. LOGIC TỰ ĐỘNG SINH BIẾN THỂ =================
  // Mỗi khi 'attributes' thay đổi -> Tính toán lại 'variants'
  useEffect(() => {
    // Chỉ chạy logic sinh tự động nếu có thuộc tính
    if (attributes.length === 0) return;

    // Hàm tạo tổ hợp (Cartesian Product)
    const cartesian = (args) => {
      const result = [];
      const max = args.length - 1;
      function helper(arr, i) {
        for (let j = 0, l = args[i].length; j < l; j++) {
          const a = arr.slice(0);
          a.push(args[i][j]);
          if (i === max) result.push(a);
          else helper(a, i + 1);
        }
      }
      helper([], 0);
      return result;
    };

    // Lấy ra các mảng giá trị (VD: [['Đỏ', 'Xanh'], ['S', 'M']])
    const args = attributes
      .map((attr) => attr.values)
      .filter((vals) => vals.length > 0);
    if (args.length === 0) return;

    const combinations = cartesian(args); // [['Đỏ', 'S'], ['Đỏ', 'M']...]

    // Map tổ hợp thành variant objects
    const newVariants = combinations.map((combo) => {
      const options = {};
      const skuParts = [];

      attributes.forEach((attr, idx) => {
        options[attr.name] = combo[idx];
        skuParts.push(combo[idx]);
      });

      // Kiểm tra xem biến thể này đã tồn tại chưa (để giữ lại giá/kho user đã nhập)
      const existing = variants.find(
        (v) => JSON.stringify(v.options) === JSON.stringify(options),
      );
      if (existing) return existing;

      return {
        sku: skuParts.join("-").toUpperCase(),
        price: formData.price || 0,
        stock: 0,
        options: options,
      };
    });

    // Cập nhật lại state variants (Chỉ khi số lượng thay đổi để tránh loop vô hạn)
    if (newVariants.length !== variants.length || attributes.length > 0) {
      // Logic này cần tinh chỉnh tùy UX, ở đây ta set luôn cái mới
      setVariants(newVariants);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]); // Trigger khi attributes thay đổi

  // ================= 3. HANDLERS XỬ LÝ FORM =================

  // --- Input cơ bản ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("shipping.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        shipping: { ...prev.shipping, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- Xử lý Attributes (Thêm/Xóa thuộc tính) ---
  const addAttribute = () =>
    setAttributes([...attributes, { name: "", values: [] }]);
  const removeAttribute = (idx) =>
    setAttributes(attributes.filter((_, i) => i !== idx));

  const handleAttrNameChange = (idx, val) => {
    const newAttrs = [...attributes];
    newAttrs[idx].name = val;
    setAttributes(newAttrs);
  };

  const addAttrValue = (idx, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val) {
        const newAttrs = [...attributes];
        if (!newAttrs[idx].values.includes(val)) {
          newAttrs[idx].values.push(val);
          setAttributes(newAttrs);
        }
        e.target.value = "";
      }
    }
  };

  const removeAttrValue = (attrIdx, valIdx) => {
    const newAttrs = [...attributes];
    newAttrs[attrIdx].values.splice(valIdx, 1);
    setAttributes(newAttrs);
  };

  // --- Xử lý Variants (Sửa giá/kho từng dòng) ---
  const handleVariantChange = (idx, field, val) => {
    const newVars = [...variants];
    newVars[idx][field] = val;
    setVariants(newVars);
  };

  const applyToAll = (field, val) => {
    setVariants(variants.map((v) => ({ ...v, [field]: val })));
  };

  // --- Xử lý Ảnh (Phức tạp) ---
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 1. Lưu file vào mảng để gửi lên server
    setNewImageFiles((prev) => [...prev, ...files]);

    // 2. Tạo URL preview hiển thị ngay
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file, // Đánh dấu đây là ảnh mới (có file)
      isOld: false,
    }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const target = previewImages[index];

    if (target.isOld) {
      // Nếu là ảnh cũ -> Thêm public_id vào danh sách xóa
      setDeletedImageIds((prev) => [...prev, target.public_id]);
    } else {
      // Nếu là ảnh mới -> Loại bỏ khỏi mảng newImageFiles
      setNewImageFiles((prev) => prev.filter((f) => f !== target.file));
      URL.revokeObjectURL(target.url); // Giải phóng bộ nhớ
    }

    // Xóa khỏi UI preview
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };
  // --- Xử lý Video (Mới thêm) ---
  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 1. Lưu file vào mảng để gửi lên server
    setNewVideoFiles((prev) => [...prev, ...files]);

    // 2. Tạo URL preview
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
      isOld: false,
    }));
    setPreviewVideos((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const handleRemoveVideo = (index) => {
    const target = previewVideos[index];

    if (!target.isOld) {
      // Nếu là video mới -> Xóa khỏi mảng file upload và revoke URL
      setNewVideoFiles((prev) => prev.filter((f) => f !== target.file));
      URL.revokeObjectURL(target.url);
    }

    // Xóa khỏi UI preview
    setPreviewVideos((prev) => prev.filter((_, i) => i !== index));
  };
  // ================= 4. SUBMIT FORM =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate logic
      if (formData.type === "variable" && variants.length === 0) {
        alert("Vui lòng tạo ít nhất 1 biến thể!");
        setSubmitting(false);
        return;
      }

      // Tạo Payload (Object thuần)
      // Hook 'useProducts' sẽ lo việc convert cái này thành FormData
      const payload = {
        ...formData,
        // Convert số học
        price: Number(formData.price),
        stock: formData.type === "simple" ? Number(formData.stock) : 0,
        originalPrice: Number(formData.originalPrice),
        shipping: {
          weight: Number(formData.shipping.weight),
          height: Number(formData.shipping.height),
          length: Number(formData.shipping.length),
          width: Number(formData.shipping.width),
        },

        // Dữ liệu phức tạp
        variants: formData.type === "variable" ? variants : [],
        variantAttributes: formData.type === "variable" ? attributes : [],
        specifications,

        // Ảnh
        newImages: newImageFiles, // Mảng File
        deletedImages: deletedImageIds, // Mảng String ID

        videos: newVideoFiles,
      };

      // Gọi hàm submit từ cha (ProductManagement)
      await onSubmit(payload);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ================= 5. RENDER UI =================
  return (
    <form onSubmit={handleSubmit} className="p-1 space-y-6">
      {/* --- A. THÔNG TIN CƠ BẢN --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nhập tên sản phẩm..."
          />
        </div>
        <div>
          <label className="label">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            className="input"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Thương hiệu</label>
          <input
            className="input"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="VD: Apple, Samsung"
          />
        </div>
      </div>

      {/* --- B. PHÂN LOẠI & GIÁ --- */}
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-3">Thông tin bán hàng</h3>

        {/* Chọn loại sản phẩm */}
        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="simple"
              checked={formData.type === "simple"}
              onChange={handleChange}
            />
            <span>Sản phẩm đơn</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="variable"
              checked={formData.type === "variable"}
              onChange={handleChange}
            />
            <span>Sản phẩm có biến thể (Màu, Size)</span>
          </label>
        </div>

        {formData.type === "simple" ? (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Giá bán (VNĐ)</label>
              <input
                type="number"
                name="price"
                className="input"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Giá gốc (Gạch ngang)</label>
              <input
                type="number"
                name="originalPrice"
                className="input"
                value={formData.originalPrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Kho hàng</label>
              <input
                type="number"
                name="stock"
                className="input"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        ) : (
          // --- GIAO DIỆN BIẾN THỂ ---
          <div className="space-y-4">
            {/* 1. Định nghĩa thuộc tính */}
            <div className="bg-white p-3 rounded border">
              <h4 className="text-sm font-bold mb-2">1. Nhóm phân loại</h4>
              {attributes.map((attr, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-start">
                  <input
                    className="input w-1/3 bg-gray-50"
                    placeholder="Tên (VD: Màu)"
                    value={attr.name}
                    onChange={(e) => handleAttrNameChange(idx, e.target.value)}
                  />

                  <div className="flex-1 border p-2 rounded flex flex-wrap gap-2 min-h-[40px] bg-white">
                    {attr.values.map((val, vIdx) => (
                      <span
                        key={vIdx}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1"
                      >
                        {val}{" "}
                        <button
                          type="button"
                          onClick={() => removeAttrValue(idx, vIdx)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      className="outline-none text-sm min-w-[80px]"
                      placeholder="Nhập giá trị + Enter"
                      onKeyDown={(e) => addAttrValue(idx, e)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttribute(idx)}
                    className="text-red-500 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAttribute}
                className="text-sm text-blue-600 hover:underline"
              >
                + Thêm nhóm phân loại
              </button>
            </div>

            {/* 2. Danh sách biến thể (Table) */}
            {variants.length > 0 && (
              <div className="bg-white p-3 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold">2. Chi tiết biến thể</h4>
                  <div className="flex gap-2 items-center text-xs">
                    <span>Áp dụng tất cả:</span>
                    <input
                      className="border rounded p-1 w-20"
                      placeholder="Giá"
                      onBlur={(e) => applyToAll("price", e.target.value)}
                    />
                    <input
                      className="border rounded p-1 w-16"
                      placeholder="Kho"
                      onBlur={(e) => applyToAll("stock", e.target.value)}
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto border rounded">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 sticky top-0">
                      <tr>
                        <th className="px-3 py-2">Phân loại</th>
                        <th className="px-3 py-2">Giá</th>
                        <th className="px-3 py-2">Kho</th>
                        <th className="px-3 py-2">SKU</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {variants.map((v, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-medium">
                            {Object.values(v.options).join(" / ")}
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="input py-1"
                              value={v.price}
                              onChange={(e) =>
                                handleVariantChange(i, "price", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="input py-1"
                              value={v.stock}
                              onChange={(e) =>
                                handleVariantChange(i, "stock", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="input py-1 bg-gray-50"
                              value={v.sku}
                              onChange={(e) =>
                                handleVariantChange(i, "sku", e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- C. VẬN CHUYỂN --- */}
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FaTruck /> Vận chuyển
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="label">Cân nặng (g) *</label>
            <input
              type="number"
              name="shipping.weight"
              className="input"
              value={formData.shipping.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label">Dài (cm)</label>
            <input
              type="number"
              name="shipping.length"
              className="input"
              value={formData.shipping.length}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Rộng (cm)</label>
            <input
              type="number"
              name="shipping.width"
              className="input"
              value={formData.shipping.width}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Cao (cm)</label>
            <input
              type="number"
              name="shipping.height"
              className="input"
              value={formData.shipping.height}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* --- D. HÌNH ẢNH --- */}
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-3">Hình ảnh sản phẩm</h3>
        {/* Truyền đúng props mà MediaUpload cần */}
        <MediaUpload
          selectedImages={previewImages.map((i) => i.url)} // Chỉ truyền mảng string URL để hiển thị
          onImageSelect={handleImageSelect}
          onRemoveImage={handleRemoveImage}
          selectedVideos={previewVideos.map((v) => v.url)} // Truyền mảng URL video
          onVideoSelect={handleVideoSelect} // Hàm chọn video
          onRemoveVideo={handleRemoveVideo}
          disabled={submitting}
        />
      </div>

      {/* --- E. MÔ TẢ --- */}
      <div>
        <label className="label">Mô tả chi tiết</label>
        <textarea
          name="description"
          rows="5"
          className="input"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white p-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex items-center gap-2"
        >
          {submitting && <span className="animate-spin">⏳</span>}
          {isEditing ? "Lưu thay đổi" : "Thêm sản phẩm"}
        </button>
      </div>

      {/* CSS Styles (Inline cho gọn) */}
      <style>{`
        .label { display: block; font-size: 0.85rem; font-weight: 500; margin-bottom: 4px; color: #374151; }
        .input { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; transition: 0.2s; }
        .input:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
        .btn-primary { background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; font-weight: 500; transition: 0.2s; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-secondary { background: white; border: 1px solid #d1d5db; color: #374151; padding: 10px 20px; border-radius: 6px; font-weight: 500; transition: 0.2s; }
        .btn-secondary:hover { background: #f3f4f6; }
      `}</style>
    </form>
  );
};

export default ProductForm;
