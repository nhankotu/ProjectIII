import express from "express";
import {
  getSellerProducts,
  getSellerProductById,
  addSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
} from "../../controllers/seller/sellerController.js";
import {
  getShopSettings,
  updateShopSettings,
  uploadShopImage,
} from "../../controllers/seller/shopSettingsController.js";
import { requireAuth, requireSeller } from "../../middleware/authMiddleware.js";
import {
  uploadProductFiles,
  uploadShopImageMemory,
  uploadForCloudinary,
} from "../../middleware/uploadMiddleware.js";
import {
  getSellerFlashSales,
  registerProductToFlashSale,
  getAvailableFlashSales,
} from "../../controllers/seller/flashSaleController.js";
import { getFinancialOverview } from "../../controllers/seller/financialController.js";
import {
  getSellerCategories,
  getSellerCategoryById,
} from "../../controllers/seller/categoryController.js";
import {
  getSellerOrders,
  updateOrderStatus,
  getOrderStats,
} from "../../controllers/seller/orderController.js";

import {
  getSellerConversations,
  sendReply,
  getSellerMessages,
  markAsRead,
} from "../../controllers/seller/sellerChatController.js";

import {
  getShopReviews,
  getProductReviews,
  replyToReview,
  getShopReviewStats,
  getProductReviewStats,
} from "../../controllers/seller/SellerReviewController.js";

const router = express.Router();

// ============================================================
// QUẢN LÝ SẢN PHẨM
// ============================================================
router.get("/products", requireAuth, requireSeller, getSellerProducts);
router.post(
  "/products",
  requireAuth,
  requireSeller,
  uploadForCloudinary,
  addSellerProduct,
);
router.put(
  "/products/:id",
  requireAuth,
  requireSeller,
  uploadForCloudinary,
  updateSellerProduct,
);
router.delete("/products/:id", requireAuth, requireSeller, deleteSellerProduct);
router.get("/products/:id", requireAuth, requireSeller, getSellerProductById);

// ============================================================
// CÀI ĐẶT SHOP
// ============================================================
router.get("/shop/settings", requireAuth, requireSeller, getShopSettings);
router.put("/shop/settings", requireAuth, requireSeller, updateShopSettings);
router.post(
  "/shop/settings/upload",
  requireAuth,
  requireSeller,
  uploadShopImageMemory,
  uploadShopImage,
);

// ============================================================
// FLASH SALE
// ============================================================
router.get("/flash-sales", requireAuth, requireSeller, getSellerFlashSales);
router.get(
  "/flash-sales/available",
  requireAuth,
  requireSeller,
  getAvailableFlashSales,
);
router.post(
  "/flash-sales/register",
  requireAuth,
  requireSeller,
  registerProductToFlashSale,
);

// ============================================================
// TÀI CHÍNH & DANH MỤC
// ============================================================
router.get(
  "/financial/overview",
  requireAuth,
  requireSeller,
  getFinancialOverview,
);
router.get("/categories", getSellerCategories);
router.get("/categories/:id", requireAuth, getSellerCategoryById);

// ============================================================
// QUẢN LÝ ĐƠN HÀNG
// ============================================================
router.get("/orders/stats", requireAuth, requireSeller, getOrderStats);
router.get("/orders", requireAuth, requireSeller, getSellerOrders);
router.put("/orders/:id", requireAuth, requireSeller, updateOrderStatus);

// ============================================================
// 🔥 2. THÊM ROUTE CHO CHAT / MESSAGE
// ============================================================
// Lấy danh sách hội thoại (Inbox)
router.get(
  "/chat/conversations",
  requireAuth,
  requireSeller,
  getSellerConversations,
);

// Lấy nội dung tin nhắn của 1 hội thoại cụ thể
router.get(
  "/chat/messages/:conversationId",
  requireAuth,
  requireSeller,
  getSellerMessages,
);

// Gửi tin nhắn trả lời
router.post(
  "/chat/message",
  requireAuth,
  requireSeller,
  uploadForCloudinary,
  sendReply,
);

// Đánh dấu đã đọc
router.put("/chat/read", requireAuth, requireSeller, markAsRead);

// ============================================================
// 🔥 3. THÊM ROUTE CHO REVIEW / ĐÁNH GIÁ
// ============================================================

router.get("/reviews", requireAuth, requireSeller, getShopReviews);

router.get("/reviews/stats", requireAuth, requireSeller, getShopReviewStats);

router.get("/products/:productId/reviews", getProductReviews);

router.get(
  "/products/:productId/reviews/stats",
  requireAuth,
  requireSeller,
  getProductReviewStats,
);

router.put(
  "/reviews/:reviewId/reply",
  requireAuth,
  requireSeller,
  replyToReview,
);

export default router;
