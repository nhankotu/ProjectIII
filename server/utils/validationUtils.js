// utils/validationUtils.js

// ✅ Validation cho seller product
export const validateSellerProduct = (productData) => {
  const errors = [];

  // 1. Required fields
  if (!productData.name || productData.name.trim().length < 3) {
    errors.push("Tên sản phẩm phải có ít nhất 3 ký tự");
  }

  if (!productData.price || parseFloat(productData.price) <= 0) {
    errors.push("Giá sản phẩm phải lớn hơn 0");
  }

  if (!productData.category || productData.category.trim().length === 0) {
    errors.push("Danh mục sản phẩm là bắt buộc");
  }

  if (!productData.stock || parseInt(productData.stock) < 0) {
    errors.push("Số lượng sản phẩm không hợp lệ");
  }

  // 2. Optional but validation if provided
  if (
    productData.originalPrice &&
    parseFloat(productData.originalPrice) < parseFloat(productData.price)
  ) {
    errors.push("Giá gốc không được thấp hơn giá bán");
  }

  if (
    productData.discount &&
    (productData.discount < 0 || productData.discount > 100)
  ) {
    errors.push("Giảm giá phải từ 0% đến 100%");
  }

  if (productData.slug && !/^[a-z0-9-]+$/.test(productData.slug)) {
    errors.push("Slug chỉ được chứa chữ thường, số và dấu gạch ngang");
  }

  // 3. Length validations
  if (productData.name && productData.name.length > 200) {
    errors.push("Tên sản phẩm không được vượt quá 200 ký tự");
  }

  if (productData.description && productData.description.length > 5000) {
    errors.push("Mô tả không được vượt quá 5000 ký tự");
  }

  // 4. Business logic validations
  if (productData.maxQuantity && productData.maxQuantity < 1) {
    errors.push("Số lượng tối đa phải lớn hơn 0");
  }

  if (productData.lowStockThreshold && productData.lowStockThreshold < 0) {
    errors.push("Ngưỡng cảnh báo tồn kho không hợp lệ");
  }

  return errors;
};

// ✅ Validation cho product update
export const validateProductUpdate = (updateData) => {
  const errors = [];

  if (updateData.name && updateData.name.trim().length < 3) {
    errors.push("Tên sản phẩm phải có ít nhất 3 ký tự");
  }

  if (updateData.price && parseFloat(updateData.price) <= 0) {
    errors.push("Giá sản phẩm phải lớn hơn 0");
  }

  if (updateData.stock !== undefined && parseInt(updateData.stock) < 0) {
    errors.push("Số lượng sản phẩm không hợp lệ");
  }

  return errors;
};

// ✅ Validation cho product images
export const validateProductImages = (files) => {
  const errors = [];

  if (!files || files.length === 0) {
    return errors; // Không có ảnh cũng được
  }

  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  files.forEach((file, index) => {
    // Check mime type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`File ${index + 1}: Chỉ chấp nhận ảnh JPEG, PNG, WebP`);
    }

    // Check file size
    if (file.size > maxFileSize) {
      errors.push(`File ${index + 1}: Kích thước không được vượt quá 5MB`);
    }
  });

  return errors;
};

// ✅ Validation cho product videos
export const validateProductVideos = (files) => {
  const errors = [];

  if (!files || files.length === 0) {
    return errors; // Không có video cũng được
  }

  const allowedMimeTypes = ["video/mp4", "video/mpeg", "video/quicktime"];
  const maxFileSize = 50 * 1024 * 1024; // 50MB cho video

  files.forEach((file, index) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`Video ${index + 1}: Chỉ chấp nhận MP4, MPEG, MOV`);
    }

    if (file.size > maxFileSize) {
      errors.push(`Video ${index + 1}: Kích thước không được vượt quá 50MB`);
    }
  });

  return errors;
};

// ✅ Validation cho product status
export const validateProductStatus = (status) => {
  const validStatuses = [
    "active",
    "inactive",
    "pending",
    "out_of_stock",
    "low_stock",
  ];
  return validStatuses.includes(status);
};

// ✅ Validation cho product specifications (nếu là object)
export const validateSpecifications = (specs) => {
  const errors = [];

  if (specs && typeof specs !== "object") {
    errors.push("Thông số kỹ thuật phải là object");
    return errors;
  }

  // Có thể thêm validation cụ thể cho từng field
  // Ví dụ: check độ dài của key/value

  return errors;
};

// ✅ Helper function để validate số
export const validateNumber = (value, min = 0, max = null) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (num < min) return false;
  if (max !== null && num > max) return false;
  return true;
};

// ✅ Helper function để validate chuỗi
export const validateString = (str, minLength = 0, maxLength = null) => {
  if (!str || typeof str !== "string") return false;
  if (str.trim().length < minLength) return false;
  if (maxLength !== null && str.length > maxLength) return false;
  return true;
};
