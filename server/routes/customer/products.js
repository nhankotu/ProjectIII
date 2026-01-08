// routes/products.js
import express from "express";
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getHotProducts,
} from "../../controllers/customer/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/hot", getHotProducts);
router.get("/:id", getProductById);

export default router;
