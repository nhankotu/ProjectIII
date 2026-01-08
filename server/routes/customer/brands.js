// routes/brands.js
import express from "express";
import {
  getBrands,
  getBrandById,
} from "../../controllers/customer/brandController.js";

const router = express.Router();

router.get("/", getBrands);
router.get("/:id", getBrandById);

export default router;
