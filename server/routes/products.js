import express from "express";
import Product from "../models/product.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Cấu hình Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

// [GET] /api/products → lấy tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
});

// [POST] /api/products → thêm sản phẩm mới với ảnh
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      console.log("📦 Files received:", req.files);
      console.log("📝 Body data:", req.body);

      const { name, description, price, category, stock, status } = req.body;

      // Kiểm tra dữ liệu bắt buộc
      if (!name || !price) {
        return res.status(400).json({
          message: "Tên và giá sản phẩm là bắt buộc",
        });
      }

      // Xử lý ảnh từ Cloudinary
      const images = req.files?.images
        ? req.files.images.map((file) => ({
            url: file.path,
            public_id: file.filename,
            secure_url: file.path,
          }))
        : [];

      // Xử lý video từ Cloudinary
      const videos = req.files?.videos
        ? req.files.videos.map((file) => ({
            url: file.path,
            public_id: file.filename,
            secure_url: file.path,
          }))
        : [];

      console.log("🖼️ Processed images:", images);
      console.log("🎥 Processed videos:", videos);

      // Tạo sản phẩm mới với status hợp lệ
      const newProduct = new Product({
        name,
        description: description || "",
        price: Number(price),
        category: category || "Uncategorized",
        stock: stock ? Number(stock) : 0,
        status: status || "pending", // Sử dụng "pending" thay vì "active"
        images,
        videos,
      });

      const savedProduct = await newProduct.save();

      console.log("✅ Product saved successfully:", savedProduct);

      res.status(201).json({
        message: "✅ Thêm sản phẩm thành công",
        product: savedProduct,
      });
    } catch (error) {
      console.error("❌ Error creating product:", error);
      res.status(500).json({
        message: "Lỗi server khi thêm sản phẩm",
        error: error.message,
      });
    }
  }
);
// [DELETE] /api/products/:id → xóa sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Tìm sản phẩm trước khi xóa để lấy thông tin ảnh/video
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Xóa ảnh và video từ Cloudinary (nếu có)
    try {
      // Xóa ảnh
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        }
      }

      // Xóa video
      if (product.videos && product.videos.length > 0) {
        for (const video of product.videos) {
          if (video.public_id) {
            await cloudinary.uploader.destroy(video.public_id, {
              resource_type: "video",
            });
          }
        }
      }
    } catch (cloudinaryError) {
      console.error("Lỗi khi xóa file từ Cloudinary:", cloudinaryError);
      // Vẫn tiếp tục xóa sản phẩm dù có lỗi Cloudinary
    }

    // Xóa sản phẩm từ database
    await Product.findByIdAndDelete(productId);

    res.json({
      message: "✅ Xóa sản phẩm thành công",
      deletedProduct: product,
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({
      message: "Lỗi server khi xóa sản phẩm",
      error: error.message,
    });
  }
});

export default router;
