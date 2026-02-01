import { forwardRef, useImperativeHandle, useState, useEffect } from "react";

const BasicInfoSection = forwardRef(
  ({ data, uploadImage, onSave, isSaving }, ref) => {
    // 1. State lưu thông tin text và URL ảnh (từ DB hoặc sau khi upload xong)
    const [form, setForm] = useState({
      name: "",
      description: "",
      logo: "", // URL ảnh cũ trên server
      banner: "", // URL ảnh cũ trên server
      ...data,
    });

    // 2. State lưu File thô người dùng vừa chọn (để chờ upload)
    const [selectedFiles, setSelectedFiles] = useState({
      logo: null,
      banner: null,
    });

    // 3. State lưu URL preview (ảnh ảo xem trước ở client)
    const [previews, setPreviews] = useState({
      logo: null,
      banner: null,
    });

    // Đồng bộ data từ props nếu API cha load chậm
    useEffect(() => {
      if (data) {
        setForm((prev) => ({ ...prev, ...data }));
      }
    }, [data]);

    // Cleanup: Xóa bộ nhớ ảnh preview khi component unmount hoặc thay ảnh khác
    useEffect(() => {
      return () => {
        if (previews.logo) URL.revokeObjectURL(previews.logo);
        if (previews.banner) URL.revokeObjectURL(previews.banner);
      };
    }, [previews]);

    // ==========================================
    // LOGIC MỚI: Xử lý Submit (Upload lúc bấm Lưu)
    // ==========================================
    useImperativeHandle(ref, () => ({
      // Hàm này giờ sẽ là ASYNC vì phải đợi Upload xong
      submit: async () => {
        let finalForm = { ...form };
        let hasError = false;

        // 1. Kiểm tra: Nếu có chọn Logo mới thì Upload Logo
        if (selectedFiles.logo) {
          try {
            const res = await uploadImage(selectedFiles.logo, "logo");
            if (res.success) {
              finalForm.logo = res.data.imageUrl; // Cập nhật URL mới
            } else {
              hasError = true;
            }
          } catch (err) {
            hasError = true;
          }
        }

        // 2. Kiểm tra: Nếu có chọn Banner mới thì Upload Banner
        if (selectedFiles.banner) {
          try {
            const res = await uploadImage(selectedFiles.banner, "banner");
            if (res.success) {
              finalForm.banner = res.data.imageUrl; // Cập nhật URL mới
            } else {
              hasError = true;
            }
          } catch (err) {
            hasError = true;
          }
        }

        if (hasError) {
          alert("Có lỗi khi upload ảnh, vui lòng thử lại!");
          return null; // Trả về null báo hiệu lỗi
        }

        // 3. Trả về form data đã có URL ảnh đầy đủ
        return finalForm;
      },
      isValid: () => !!form.name,
    }));

    // ==========================================
    // Xử lý chọn file (Chỉ tạo Preview)
    // ==========================================
    const handleFileSelect = (e, type) => {
      const file = e.target.files[0];
      if (!file) return;

      // 1. Lưu file thô để dành tí nữa upload
      setSelectedFiles((prev) => ({ ...prev, [type]: file }));

      // 2. Tạo URL ảo để hiển thị ngay lập tức (Preview)
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [type]: objectUrl }));

      // Reset input để chọn lại được file giống cũ nếu cần
      e.target.value = null;
    };

    return (
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">
          Thông tin cơ bản
        </h2>

        {/* Tên Shop */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên Shop <span className="text-red-500">*</span>
          </label>
          <input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nhập tên shop..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả giới thiệu
          </label>
          <textarea
            rows={4}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Giới thiệu đôi nét về shop..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
              {/* Ưu tiên hiện Preview mới, nếu không có thì hiện ảnh cũ từ Server */}
              {previews.logo ? (
                <img
                  src={previews.logo}
                  alt="Logo Preview"
                  className="w-full h-full object-cover"
                />
              ) : form.logo ? (
                <img
                  src={form.logo}
                  alt="Logo Old"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">Chưa có</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, "logo")}
              className="text-sm text-gray-500"
            />
          </div>
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh bìa (Banner)
          </label>
          <div className="relative w-full h-32 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
            {previews.banner ? (
              <img
                src={previews.banner}
                alt="Banner Preview"
                className="w-full h-full object-cover"
              />
            ) : form.banner ? (
              <img
                src={form.banner}
                alt="Banner Old"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">Chưa có ảnh bìa</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, "banner")}
            className="mt-2 text-sm text-gray-500"
          />
        </div>
        {/* 👇 THÊM NÚT LƯU Ở CUỐI COMPONENT */}
        <div className="flex justify-end pt-4 border-t mt-4">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2 text-sm font-medium"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Đang lưu...
              </>
            ) : (
              "💾 Lưu thay đổi"
            )}
          </button>
        </div>
      </div>
    );
  }
);

export default BasicInfoSection;
