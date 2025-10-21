/**
 * Application constants
 */

// App Config
export const APP_CONFIG = {
  NAME: "YourShop",
  VERSION: "1.0.0",
  DESCRIPTION: "E-commerce platform",
  AUTHOR: "YourShop Team",
  SUPPORT_EMAIL: "support@yourshop.com",
  SUPPORT_PHONE: "1900 1234",
  ADDRESS: "123 Trần Duy Hưng, Cầu Giấy, Hà Nội",
  CURRENCY: "VND",
  LANGUAGE: "vi-VN",
  MAX_CART_ITEMS: 100,
  MAX_WISHLIST_ITEMS: 50,
  ITEMS_PER_PAGE: 20,
  FREE_SHIPPING_THRESHOLD: 300000,
  DEFAULT_SHIPPING_FEE: 25000,
};

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  AUTH: "/auth",
  USERS: "/users",
  ORDERS: "/orders",
  CART: "/cart",
  REVIEWS: "/reviews",
  UPLOAD: "/upload",
};

// Route Paths
export const ROUTES = {
  // Public routes
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/product/:id",
  CATEGORY: "/category/:slug",
  CART: "/cart",
  CHECKOUT: "/checkout",
  SEARCH: "/search",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // User routes
  PROFILE: "/profile",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/:id",
  ADDRESSES: "/addresses",
  WISHLIST: "/wishlist",
  SETTINGS: "/settings",

  // Static pages
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  RETURN_POLICY: "/return-policy",
  SHIPPING_POLICY: "/shipping-policy",
};

// Product Constants
export const PRODUCT_CONSTANTS = {
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    OUT_OF_STOCK: "out_of_stock",
    COMING_SOON: "coming_soon",
  },

  CONDITION: {
    NEW: "new",
    USED: "used",
    REFURBISHED: "refurbished",
  },

  SORT_OPTIONS: [
    { value: "newest", label: "Mới nhất" },
    { value: "price_asc", label: "Giá thấp đến cao" },
    { value: "price_desc", label: "Giá cao đến thấp" },
    { value: "name_asc", label: "Tên A-Z" },
    { value: "name_desc", label: "Tên Z-A" },
    { value: "rating_desc", label: "Đánh giá cao" },
    { value: "best_seller", label: "Bán chạy" },
  ],

  FILTER_OPTIONS: {
    PRICE_RANGES: [
      { label: "Dưới 1 triệu", min: 0, max: 1000000 },
      { label: "1 - 3 triệu", min: 1000000, max: 3000000 },
      { label: "3 - 5 triệu", min: 3000000, max: 5000000 },
      { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
      { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
      { label: "Trên 20 triệu", min: 20000000, max: 50000000 },
    ],

    RATINGS: [
      { value: 5, label: "5 sao" },
      { value: 4, label: "4 sao trở lên" },
      { value: 3, label: "3 sao trở lên" },
      { value: 2, label: "2 sao trở lên" },
      { value: 1, label: "1 sao trở lên" },
    ],
  },
};

// Order Constants
export const ORDER_CONSTANTS = {
  STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    SHIPPING: "shipping",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
  },

  STATUS_LABELS: {
    pending: { label: "Chờ xác nhận", color: "orange" },
    confirmed: { label: "Đã xác nhận", color: "blue" },
    processing: { label: "Đang xử lý", color: "purple" },
    shipping: { label: "Đang giao hàng", color: "cyan" },
    delivered: { label: "Đã giao hàng", color: "green" },
    cancelled: { label: "Đã hủy", color: "red" },
    refunded: { label: "Đã hoàn tiền", color: "gray" },
  },

  PAYMENT_METHODS: {
    COD: { value: "cod", label: "Thanh toán khi nhận hàng" },
    MOMO: { value: "momo", label: "Ví MoMo" },
    BANKING: { value: "banking", label: "Chuyển khoản ngân hàng" },
    CREDIT_CARD: { value: "credit_card", label: "Thẻ tín dụng/ghi nợ" },
  },

  SHIPPING_METHODS: {
    STANDARD: {
      value: "standard",
      label: "Giao hàng tiêu chuẩn",
      fee: 25000,
      days: "3-5 ngày",
    },
    EXPRESS: {
      value: "express",
      label: "Giao hàng nhanh",
      fee: 50000,
      days: "1-2 ngày",
    },
    FREE: {
      value: "free",
      label: "Giao hàng miễn phí",
      fee: 0,
      days: "3-5 ngày",
    },
  },
};

// User Constants
export const USER_CONSTANTS = {
  ROLES: {
    CUSTOMER: "customer",
    SELLER: "seller",
    ADMIN: "admin",
  },

  GENDERS: {
    MALE: "male",
    FEMALE: "female",
    OTHER: "other",
  },
};

// Notification Constants
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  CART_ITEMS: "cartItems",
  WISHLIST_ITEMS: "wishlistItems",
  RECENT_SEARCHES: "recentSearches",
  USER_PREFERENCES: "userPreferences",
  THEME_MODE: "themeMode",
  LANGUAGE: "language",
};

// Date & Time Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: "DD/MM/YYYY",
  DISPLAY_TIME: "HH:mm",
  DISPLAY_DATETIME: "DD/MM/YYYY HH:mm",
  API_DATE: "YYYY-MM-DD",
  API_DATETIME: "YYYY-MM-DDTHH:mm:ssZ",
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "Trường này là bắt buộc",
  INVALID_EMAIL: "Email không hợp lệ",
  INVALID_PHONE: "Số điện thoại không hợp lệ",
  INVALID_PASSWORD: "Mật khẩu phải có ít nhất 6 ký tự",
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
  MIN_LENGTH: (min) => `Phải có ít nhất ${min} ký tự`,
  MAX_LENGTH: (max) => `Không được vượt quá ${max} ký tự`,
  MIN_VALUE: (min) => `Giá trị phải lớn hơn hoặc bằng ${min}`,
  MAX_VALUE: (max) => `Giá trị phải nhỏ hơn hoặc bằng ${max}`,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại.",
  SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau.",
  UNAUTHORIZED: "Bạn cần đăng nhập để thực hiện hành động này.",
  FORBIDDEN: "Bạn không có quyền thực hiện hành động này.",
  NOT_FOUND: "Không tìm thấy dữ liệu.",
  UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Đăng nhập thành công!",
  REGISTER_SUCCESS: "Đăng ký thành công!",
  PROFILE_UPDATE_SUCCESS: "Cập nhật thông tin thành công!",
  PASSWORD_CHANGE_SUCCESS: "Đổi mật khẩu thành công!",
  ORDER_SUCCESS: "Đặt hàng thành công!",
  ADD_TO_CART_SUCCESS: "Đã thêm vào giỏ hàng!",
  ADD_TO_WISHLIST_SUCCESS: "Đã thêm vào danh sách yêu thích!",
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/yourshop",
  TWITTER: "https://twitter.com/yourshop",
  INSTAGRAM: "https://instagram.com/yourshop",
  YOUTUBE: "https://youtube.com/yourshop",
  ZALO: "https://zalo.me/yourshop",
};

// Payment Icons
export const PAYMENT_ICONS = {
  COD: "/images/payments/cod.png",
  MOMO: "/images/payments/momo.png",
  VISA: "/images/payments/visa.png",
  MASTERCARD: "/images/payments/mastercard.png",
  JCB: "/images/payments/jcb.png",
  BANK_TRANSFER: "/images/payments/bank-transfer.png",
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_WISHLIST: true,
  ENABLE_REVIEWS: true,
  ENABLE_COMPARE: false,
  ENABLE_QUICK_VIEW: true,
  ENABLE_SOCIAL_LOGIN: false,
  ENABLE_MULTI_LANGUAGE: false,
  ENABLE_DARK_MODE: true,
};
