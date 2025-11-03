import express from "express";
import {
  getSellerProducts,
  addSellerProduct,
} from "../controllers/seller/sellerController.js";
import {
  getShopSettings,
  updateShopSettings,
} from "../controllers/seller/shopSettingsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = express.Router();

// Danh sách sản phẩm của người bán
router.get("/products", getSellerProducts);

// Thêm sản phẩm mới
router.post("/products", addSellerProduct);

// GET /api/shop/settings - Lấy shop settings
router.get("/settings", requireAuth, getShopSettings);

// PUT /api/shop/settings - Cập nhật shop settings
router.put("/settings", requireAuth, updateShopSettings);

export default router;
