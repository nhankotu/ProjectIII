import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// 🧩 Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách sản phẩm", error: err.message });
  }
});

// ➕ Thêm sản phẩm mới
router.post("/", async (req, res) => {
  try {
    const { name, description, price, images, videos } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Thiếu tên hoặc giá sản phẩm" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      images,
      videos,
    });
    const savedProduct = await newProduct.save();

    res.json({
      message: "✅ Đã thêm sản phẩm thành công",
      product: savedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Lỗi khi thêm sản phẩm", error: err.message });
  }
});

export default router;
