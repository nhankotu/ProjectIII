/**
 * Formatting utilities for display
 */

/**
 * Format currency (VND)
 */
export function formatPrice(price, currency = "VND") {
  if (price === null || price === undefined) return "Liên hệ";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Format number with thousands separator
 */
export function formatNumber(number) {
  if (number === null || number === undefined) return "0";

  return new Intl.NumberFormat("vi-VN").format(number);
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 0) {
  if (value === null || value === undefined) return "0%";

  return new Intl.NumberFormat("vi-VN", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format date
 */
export function formatDate(date, format = "dd/MM/yyyy") {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("vi-VN", options).format(dateObj);
}

/**
 * Format datetime
 */
export function formatDateTime(date, format = "dd/MM/yyyy HH:mm") {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Intl.DateTimeFormat("vi-VN", options).format(dateObj);
}

/**
 * Format relative time (e.g., "2 giờ trước")
 */
export function formatRelativeTime(date) {
  if (!date) return "";

  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  }

  return formatDate(date);
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format phone number
 */
export function formatPhone(phone) {
  if (!phone) return "";

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format for Vietnamese phone numbers
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  }

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  }

  return phone;
}

/**
 * Format rating with stars
 */
export function formatRating(rating, maxStars = 5) {
  if (rating === null || rating === undefined) {
    return "Chưa có đánh giá";
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  let stars = "★".repeat(fullStars);
  if (hasHalfStar) {
    stars += "½";
  }
  stars += "☆".repeat(maxStars - fullStars - (hasHalfStar ? 1 : 0));

  return `${stars} (${rating.toFixed(1)})`;
}

/**
 * Format order status
 */
export function formatOrderStatus(status) {
  const statusMap = {
    pending: { label: "Chờ xác nhận", color: "text-orange-600 bg-orange-100" },
    confirmed: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-100" },
    processing: { label: "Đang xử lý", color: "text-purple-600 bg-purple-100" },
    shipping: { label: "Đang giao hàng", color: "text-cyan-600 bg-cyan-100" },
    delivered: { label: "Đã giao hàng", color: "text-green-600 bg-green-100" },
    cancelled: { label: "Đã hủy", color: "text-red-600 bg-red-100" },
    refunded: { label: "Đã hoàn tiền", color: "text-gray-600 bg-gray-100" },
  };

  return (
    statusMap[status] || {
      label: "Không xác định",
      color: "text-gray-600 bg-gray-100",
    }
  );
}

/**
 * Format payment method
 */
export function formatPaymentMethod(method) {
  const methodMap = {
    cod: "Thanh toán khi nhận hàng",
    momo: "Ví MoMo",
    banking: "Chuyển khoản ngân hàng",
    credit_card: "Thẻ tín dụng/ghi nợ",
  };

  return methodMap[method] || "Không xác định";
}

/**
 * Format shipping method
 */
export function formatShippingMethod(method) {
  const methodMap = {
    standard: "Giao hàng tiêu chuẩn",
    express: "Giao hàng nhanh",
    free: "Giao hàng miễn phí",
  };

  return methodMap[method] || "Không xác định";
}

/**
 * Format product condition
 */
export function formatProductCondition(condition) {
  const conditionMap = {
    new: "Mới",
    used: "Đã sử dụng",
    refurbished: "Đã phục hồi",
  };

  return conditionMap[condition] || "Không xác định";
}

/**
 * Format discount percentage
 */
export function formatDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }

  const discount = Math.round(
    ((originalPrice - salePrice) / originalPrice) * 100
  );
  return discount > 0 ? discount : 0;
}

/**
 * Format stock status
 */
export function formatStockStatus(stock, inStock) {
  if (!inStock) {
    return { text: "Hết hàng", color: "text-red-600" };
  }

  if (stock > 10) {
    return { text: "Còn hàng", color: "text-green-600" };
  }

  if (stock > 0) {
    return { text: `Sắp hết (${stock})`, color: "text-orange-600" };
  }

  return { text: "Hết hàng", color: "text-red-600" };
}

/**
 * Format address
 */
export function formatAddress(address) {
  if (!address) return "";

  const parts = [
    address.street,
    address.ward,
    address.district,
    address.city,
  ].filter(Boolean);

  return parts.join(", ");
}

/**
 * Format time duration
 */
export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} giờ`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} phút`);
  }

  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} giây`);
  }

  return parts.join(" ");
}

/**
 * Format social media number (e.g., 1.2K, 3.5M)
 */
export function formatSocialNumber(number) {
  if (number < 1000) {
    return number.toString();
  }

  if (number < 1000000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  if (number < 1000000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }

  return (number / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 50, ellipsis = "...") {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + ellipsis;
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str) {
  if (!str) return "";

  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate initials from name
 */
export function getInitials(name) {
  if (!name) return "";

  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format credit card number (masked)
 */
export function formatCreditCard(number) {
  if (!number) return "";

  const cleaned = number.replace(/\D/g, "");
  const lastFour = cleaned.slice(-4);

  return `•••• •••• •••• ${lastFour}`;
}

/**
 * Format order ID with prefix
 */
export function formatOrderId(id) {
  return `ORD-${String(id).padStart(8, "0")}`;
}

/**
 * Format product SKU
 */
export function formatSku(sku) {
  return `SKU-${String(sku).padStart(6, "0")}`;
}
