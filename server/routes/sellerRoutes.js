import express from "express";
import {
  getSellerProducts,
  addSellerProduct,
} from "../controllers/sellerController.js";

const router = express.Router();

// Danh sách sản phẩm của người bán
router.get("/products", getSellerProducts);

// Thêm sản phẩm mới
router.post("/products", addSellerProduct);

export default router;
