// routes/index.js
import express from "express";
import categoryRoutes from "./categories.js";
import brandRoutes from "./brands.js";
import productRoutes from "./products.js";
import bannerRoutes from "./banners.js";
import flashSaleRoutes from "./flashSales.js";
import orderRoutes from "./orderRoutes.js";
import cartRoutes from "./cartRoutes.js";
const router = express.Router();

router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/products", productRoutes);
router.use("/banners", bannerRoutes);
router.use("/flash-sales", flashSaleRoutes);
router.use("/order", orderRoutes);
router.use("/cart", cartRoutes);
export default router;
