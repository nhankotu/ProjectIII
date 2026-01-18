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
import { getSellerCategories } from "../../controllers/seller/categoryController.js";
import {
  getSellerOrders,
  updateOrderStatus,
} from "../../controllers/seller/orderController.js";
const router = express.Router();

// 🔥 SỬA - THÊM requireAuth TRƯỚC requireSeller
// Danh sách sản phẩm của người bán
router.get("/products", requireAuth, requireSeller, getSellerProducts);

// Thêm sản phẩm mới
router.post(
  "/products",
  requireAuth,
  requireSeller,
  uploadForCloudinary,
  addSellerProduct
);
router.put(
  "/products/:id",
  requireAuth,
  requireSeller,
  uploadForCloudinary,
  updateSellerProduct
);
router.delete("/products/:id", requireAuth, requireSeller, deleteSellerProduct);

router.get("/products/:id", requireAuth, requireSeller, getSellerProductById);
// GET /api/shop/settings - Lấy shop settings
router.get("/settings", requireAuth, requireSeller, getShopSettings);

// PUT /api/shop/settings - Cập nhật shop settings
router.put("/settings", requireAuth, requireSeller, updateShopSettings);

// POST /api/shop/settings/upload - Upload logo/banner
router.post(
  "/settings/upload",
  requireAuth, // 👈 THIẾU requireAuth
  requireSeller,
  uploadShopImageMemory,
  uploadShopImage
);

router.get("/flash-sales", requireAuth, requireSeller, getSellerFlashSales);
router.get(
  "/flash-sales/available",
  requireAuth,
  requireSeller,
  getAvailableFlashSales
);
router.post(
  "/flash-sales/register",
  requireAuth,
  requireSeller,
  registerProductToFlashSale
);

// GET /api/seller/financial/overview?range=month
router.get(
  "/financial/overview",
  requireAuth, // Bắt buộc đăng nhập
  requireSeller, // Bắt buộc là Seller
  getFinancialOverview // Controller xử lý
);

router.get("/categories", getSellerCategories);
// GET /api/seller/orders - Lấy danh sách đơn hàng
router.get("/orders", requireAuth, requireSeller, getSellerOrders);
router.put("/orders/:id", requireAuth, requireSeller, updateOrderStatus);

export default router;
