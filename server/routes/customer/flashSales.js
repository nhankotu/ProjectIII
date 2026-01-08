// routes/flashSales.js
import express from "express";
import { getActiveFlashSales } from "../../controllers/customer/flashSaleController.js";
const router = express.Router();

router.get("/active", getActiveFlashSales);

export default router;
