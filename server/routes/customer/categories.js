// routes/categories.js
import express from "express";
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getMenuCategories,
} from "../../controllers/customer/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);

router.get("/menu", getMenuCategories);

export default router;
