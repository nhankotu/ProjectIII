import express from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";

// --- IMPORT CONTROLLERS ---
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getMenuCategories,
} from "../../controllers/customer/categoryController.js";

import {
  getBrands,
  getBrandById,
} from "../../controllers/customer/brandController.js";

import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getHotProducts,
  getProductsByCategory,
} from "../../controllers/customer/productController.js";

import {
  getBanners,
  getActiveBanners,
} from "../../controllers/customer/bannerController.js";

import { getActiveFlashSales } from "../../controllers/customer/flashSaleController.js";

import { getPublicShopInfo } from "../../controllers/customer/shopInforController.js";

import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../../controllers/customer/cartController.js";

import {
  createOrder,
  getUserOrders,
  cancelOrder,
  getOrderDetail,
} from "../../controllers/customer/orderController.js";
import {
  upsertReview,
  deleteReview,
} from "../../controllers/customer/reviewController.js";
const router = express.Router();

// ====================================================
// A. PUBLIC ROUTES (Ai cũng xem được)
// ====================================================

// 1. CATEGORIES
router.get("/categories", getCategories);
router.get("/categories/menu", getMenuCategories); // Menu phải đặt trước :id
router.get("/categories/slug/:slug", getCategoryBySlug);
router.get("/categories/:slug/products", getProductsByCategory);
router.get("/categories/:id", getCategoryById);

// 2. BRANDS
router.get("/brands", getBrands);
router.get("/brands/:id", getBrandById);

// 3. PRODUCTS
router.get("/products", getProducts);
router.get("/products/featured", getFeaturedProducts);
router.get("/products/hot", getHotProducts);
router.get("/products/flash-sale", getActiveFlashSales);

router.get("/products/:id", getProductById);

// 4. BANNERS & FLASH SALES
router.get("/banners", getBanners);
router.get("/banners/active", getActiveBanners);
//router.get("/flash-sales/active", getActiveFlashSales);

// 5. SHOP INFO
router.get("/shop/:sellerId", getPublicShopInfo);

// ====================================================
// B. PROTECTED ROUTES (Phải đăng nhập)
// ====================================================

// --- CART (Giỏ hàng) ---
router.get("/cart", requireAuth, getCart);
router.post("/cart/add", requireAuth, addToCart);
router.put("/cart/update", requireAuth, updateCartItem);
router.delete("/cart/remove/:itemId", requireAuth, removeFromCart);

// --- ORDERS (Đơn hàng) ---
router.post("/order", requireAuth, createOrder);
router.get("/order", requireAuth, getUserOrders);
router.patch("/order/:id/cancel", requireAuth, cancelOrder);
router.get("/order/:id", requireAuth, getOrderDetail);

//--- review...
router.put("/reviews", requireAuth, upsertReview); // Tạo hoặc Sửa
router.delete("/reviews/:id", requireAuth, deleteReview); // Xóa
export default router;
