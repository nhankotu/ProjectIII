// scripts/bulkUploadProducts.js
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Lấy __dirname trong ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// ✅ Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// ✅ Hàm upload ảnh/video lên Cloudinary
const uploadToCloudinary = async (filePath, folder, resourceType = "image") => {
  try {
    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return null;
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType,
      quality: "auto",
      fetch_format: "auto",
    });

    console.log(`✅ Uploaded: ${path.basename(filePath)}`);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      secure_url: result.secure_url,
      resource_type: resourceType,
    };
  } catch (error) {
    console.error(`❌ Upload failed for ${filePath}:`, error.message);
    return null;
  }
};

// ✅ Hàm xử lý upload song song cho 1 sản phẩm
const processProduct = async (productData, sellerId) => {
  console.log(`\n📦 Processing: ${productData.name}`);

  // Upload ảnh song song
  const imagePromises = productData.images.map((imagePath) =>
    uploadToCloudinary(imagePath, "products/images", "image")
  );

  // Upload video song song
  const videoPromises = productData.videos.map((videoPath) =>
    uploadToCloudinary(videoPath, "products/videos", "video")
  );

  // Chờ tất cả upload hoàn thành
  const [imageResults, videoResults] = await Promise.all([
    Promise.all(imagePromises),
    Promise.all(videoPromises),
  ]);

  const validImages = imageResults.filter((result) => result !== null);
  const validVideos = videoResults.filter((result) => result !== null);

  console.log(
    `✅ ${validImages.length} images, ${validVideos.length} videos uploaded`
  );

  // Tạo sản phẩm trong database
  const newProduct = new Product({
    ...productData,
    sellerId: sellerId,
    images: validImages,
    videos: validVideos,
    sales: Math.floor(Math.random() * 100),
  });

  await newProduct.save();
  console.log(`✅ Saved to database: ${productData.name}`);

  return newProduct;
};

// ✅ HÀM CHẠY CHÍNH
const bulkUploadProducts = async () => {
  try {
    console.log("🚀 Bắt đầu upload hàng loạt 5 sản phẩm...");
    console.log("📁 Data location: scripts/data/");

    await connectDB();

    // ✅ ĐƯỜNG DẪN TƯƠNG ĐỐI TỪ THƯ MỤC SCRIPT
    const dataPath = path.join(__dirname, "data", "products.json");

    // Kiểm tra file JSON có tồn tại không
    if (!fs.existsSync(dataPath)) {
      console.error(`❌ File not found: ${dataPath}`);
      console.log("📋 Please make sure scripts/data/products.json exists");
      process.exit(1);
    }

    // Đọc dữ liệu từ file JSON
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const products = data.products;

    console.log(`📁 Loaded ${products.length} products from JSON`);

    // Hiển thị danh sách sản phẩm sẽ upload
    console.log("\n📋 PRODUCTS TO UPLOAD:");
    products.forEach((product, index) => {
      console.log(
        `   ${index + 1}. ${product.name} (${product.images.length} images, ${
          product.videos.length
        } videos)`
      );
    });

    // Tạo seller ID giả
    const sellerId = "69194fbf39111c74b5d0c3d0";

    // ✅ UPLOAD 5 SẢN PHẨM CÙNG LÚC (PARALLEL)
    console.log("\n🎯 Starting parallel upload...");
    const startTime = Date.now();

    const productPromises = products.map((productData) =>
      processProduct(productData, sellerId)
    );

    const results = await Promise.allSettled(productPromises);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Thống kê kết quả
    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    console.log("\n📊 ========== UPLOAD SUMMARY ==========");
    console.log(`✅ Successful: ${successful} products`);
    console.log(`❌ Failed: ${failed} products`);
    console.log(`⏱️ Total time: ${duration.toFixed(2)} seconds`);
    console.log(
      `🚀 Average: ${(duration / products.length).toFixed(2)}s per product`
    );

    // Hiển thị sản phẩm đã tạo
    console.log("\n🎉 CREATED PRODUCTS:");
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const product = result.value;
        console.log(`   ${index + 1}. ${product.name}`);
        console.log(
          `      💰 ${product.price.toLocaleString()} VND | 📦 ${
            product.stock
          } in stock`
        );
        console.log(
          `      🖼️ ${product.images.length} images | 🎥 ${product.videos.length} videos`
        );
      } else {
        console.log(`   ${index + 1}. ❌ FAILED: ${products[index].name}`);
        console.log(`      Error: ${result.reason.message}`);
      }
    });

    console.log("\n✨ Upload completed! Check your database and Cloudinary.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi upload hàng loạt:", error);
    process.exit(1);
  }
};

// Chạy script
bulkUploadProducts();
