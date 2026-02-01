import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

dotenv.config();

const checkData = async () => {
  try {
    // 1. Kết nối DB
    if (!process.env.MONGO_URI) throw new Error("❌ Thiếu MONGO_URI");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 Đã kết nối DB để kiểm tra...\n");

    // 2. Kiểm tra tổng quan
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    console.log(`📊 Tổng quan:`);
    console.log(`- Số lượng Sản phẩm: ${productCount}`);
    console.log(`- Số lượng Danh mục: ${categoryCount}\n`);

    if (productCount === 0) {
      console.log("⚠️ Không có sản phẩm nào để kiểm tra.");
      process.exit();
    }

    // 3. Soi chi tiết 1 sản phẩm bất kỳ
    const randomProduct = await Product.findOne().populate("category");
    console.log(`🔍 Soi thử sản phẩm: "${randomProduct.name}"`);
    console.log(
      `   - ID Category lưu trong Product: ${
        randomProduct.category?._id || randomProduct.category
      }`
    );

    // Nếu populate ra null, nghĩa là ID không tồn tại
    if (!randomProduct.category || !randomProduct.category.name) {
      console.log(
        `   ❌ PHÁT HIỆN LỖI: Product đang trỏ vào một Category ID không tồn tại (Hoặc đã bị xóa)!`
      );
      console.log(`      -> Đây là lý do đếm ra 0.`);
    } else {
      console.log(
        `   ✅ Khớp: Trỏ vào Category "${randomProduct.category.name}"`
      );
    }

    console.log("\n--------------------------------------------------");
    console.log(
      "📋 SO SÁNH ID THỰC TẾ (Bảng bên trái) vs ID TRONG SẢN PHẨM (Bảng bên phải)"
    );
    console.log("--------------------------------------------------");

    // 4. Liệt kê ID thật của Category hiện có
    const categories = await Category.find({}).select("name _id slug");

    // Lấy thống kê ID category đang được dùng trong bảng Product
    const productCatDistribution = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    console.log("1️⃣  DANH MỤC THẬT ĐANG CÓ TRONG DB:");
    categories.forEach((cat) => {
      console.log(`   [${cat.name.padEnd(20)}] ID Thật: ${cat._id}`);
    });

    console.log("\n2️⃣  ID MÀ SẢN PHẨM ĐANG TRỎ TỚI:");
    productCatDistribution.forEach((item) => {
      console.log(
        `   [ID: ${item._id}] -> Có ${item.count} sản phẩm đang dùng ID này.`
      );

      // Check xem ID này có nằm trong danh sách thật không
      const exists = categories.find(
        (c) => c._id.toString() === item._id.toString()
      );
      if (!exists) {
        console.log(
          `   ⚠️  CẢNH BÁO: ID ${item._id} là ID "MA" (Không tồn tại trong bảng Category)!`
        );
      }
    });
  } catch (error) {
    console.error("❌ Lỗi kiểm tra:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

checkData();
