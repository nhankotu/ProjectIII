// scripts/migrateAllProducts.js
import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const migrateAllProducts = async () => {
  try {
    console.log("🚀 Bắt đầu migration TẤT CẢ sản phẩm...");

    await connectDB();

    // ✅ LẤY TẤT CẢ SẢN PHẨM
    const products = await Product.find({});

    console.log(`📦 Tìm thấy ${products.length} sản phẩm để migration`);

    let updatedCount = 0;

    for (const product of products) {
      const updates = {};
      let hasUpdates = false;

      // 1. Tạo slug nếu chưa có
      if (!product.slug || product.slug === "") {
        updates.slug = product.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
        hasUpdates = true;
      }

      // 2. Set originalPrice nếu đang là 0
      if (!product.originalPrice || product.originalPrice === 0) {
        updates.originalPrice = product.price;
        hasUpdates = true;
      }

      // 3. Set brand mặc định nếu chưa có
      if (!product.brand || product.brand === "") {
        updates.brand = "Generic";
        hasUpdates = true;
      }

      // 4. Tính discount nếu có giảm giá
      const finalOriginalPrice = updates.originalPrice || product.originalPrice;
      if (finalOriginalPrice > product.price) {
        updates.discount = Math.round(
          ((finalOriginalPrice - product.price) / finalOriginalPrice) * 100
        );
        hasUpdates = true;
      }

      if (hasUpdates) {
        await Product.findByIdAndUpdate(product._id, updates);
        updatedCount++;

        // Hiển thị progress mỗi 10 sản phẩm
        if (updatedCount % 10 === 0) {
          console.log(`📈 Đã xử lý: ${updatedCount}/${products.length}`);
        }
      }
    }

    console.log(`\n🎉 MIGRATION HOÀN TẤT!`);
    console.log(`📊 ${updatedCount}/${products.length} sản phẩm được cập nhật`);

    await mongoose.connection.close();
    console.log("🔌 Đã đóng kết nối MongoDB");
  } catch (error) {
    console.error("❌ Lỗi migration:", error);
  } finally {
    process.exit(0);
  }
};

migrateAllProducts();
