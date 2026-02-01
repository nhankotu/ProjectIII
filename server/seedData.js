import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";

// ⚠️ ĐẢM BẢO ĐƯỜNG DẪN IMPORT ĐÚNG VỚI DỰ ÁN CỦA BẠN
import Product from "../server/models/Product.js"; // Sửa lại đường dẫn nếu cần
import Brand from "../server/models/Brand.js"; // Sửa lại đường dẫn nếu cần

dotenv.config();

// ================= CẤU HÌNH =================
const SELLER_ID = "696d1d9331e02d8c4b399096"; // ID User bạn cung cấp

// Map Category ID từ dữ liệu bạn đưa (Copy chính xác từ JSON)
const CAT_ID = {
  TABLET: "696e3ad2ce87082fa26a01c1", // Máy tính bảng
  POWERBANK: "696e3ad2ce87082fa26a01c2", // Pin sạc dự phòng
  HEADPHONE: "696e3ad2ce87082fa26a01c3", // Tai nghe & Loa
  LAPTOP_OFFICE: "696e3ad3ce87082fa26a01c7", // Laptop Văn Phòng
  PC_GAMING: "696e3ad3ce87082fa26a01c8", // PC Gaming
  MOUSE_KEYBOARD: "696e3ad3ce87082fa26a01c9", // Chuột & Bàn phím
  MENS_SHIRT: "696e3ad4ce87082fa26a01cd", // Áo thun & Polo
  MENS_SNEAKER: "696e3ad4ce87082fa26a01cf", // Giày Sneaker Nam
  WOMENS_DRESS: "696e3ad5ce87082fa26a01d3", // Váy & Đầm
  WOMENS_BAG: "696e3ad5ce87082fa26a01d4", // Túi xách nữ
  WOMENS_HEELS: "696e3ad5ce87082fa26a01d5", // Giày cao gót
  BOOKS_SKILL: "696e3ad6ce87082fa26a01df", // Sách kỹ năng
};

// Hàm helper tạo Slug
const generateSlug = (name) => {
  const base = slugify(name, { lower: true, strict: true, locale: "vi" });
  return `${base}-${Date.now().toString().slice(-4)}-${Math.floor(
    Math.random() * 1000
  )}`;
};

const seedProducts = async () => {
  try {
    // 1. Kết nối DB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("❌ Thiếu MONGO_URI");
    await mongoose.connect(mongoUri);
    console.log("🚀 Đã kết nối MongoDB...");

    // 2. Tạo Brand mẫu (Vì Product bắt buộc phải có Brand)
    console.log("🏷️ Đang tạo/tìm thương hiệu mẫu...");
    const brandsData = [
      "Apple",
      "Samsung",
      "Logitech",
      "Nike",
      "Adidas",
      "Coolmate",
      "Fahasa",
      "No Brand",
    ];
    const brandMap = {};

    for (const name of brandsData) {
      // Tìm xem có chưa, chưa thì tạo
      let brand = await Brand.findOne({ name: name });
      if (!brand) {
        brand = await Brand.create({
          name: name,
          slug: slugify(name, { lower: true }),
          description: `Thương hiệu ${name} chính hãng`,
          status: "active",
          // ✅ ĐÃ FIX: Thêm logo (dùng ảnh placeholder có tên thương hiệu)
          logo: `https://placehold.co/200x200/png?text=${name.replace(
            " ",
            "+"
          )}`,
        });
      }
      brandMap[name] = brand._id;
    }
    console.log("✅ Đã chuẩn bị xong Brand ID.");

    // 3. Xóa sản phẩm cũ của Seller này (để tránh rác)
    await Product.deleteMany({ sellerId: SELLER_ID });
    console.log("🧹 Đã dọn dẹp sản phẩm cũ của Seller.");

    // 4. Danh sách sản phẩm mẫu
    const productsToSeed = [
      // --- CÔNG NGHỆ ---
      {
        name: "MacBook Air M2 2024 13.6 inch",
        category: CAT_ID.LAPTOP_OFFICE,
        brand: brandMap["Apple"],
        price: 26990000,
        originalPrice: 28990000,
        type: "variable",
        description: "<p>Laptop mỏng nhẹ, hiệu năng mạnh mẽ với chip M2.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=800",
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800",
          },
        ],
        attributes: {
          "Màu sắc": ["Silver", "Space Gray"],
          RAM: ["8GB", "16GB"],
        },
        variants: [
          {
            sku: "MAC-M2-SLV-8",
            price: 26990000,
            stock: 10,
            options: { "Màu sắc": "Silver", RAM: "8GB" },
            image: {
              url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=800",
            },
          },
          {
            sku: "MAC-M2-GRY-16",
            price: 30990000,
            stock: 5,
            options: { "Màu sắc": "Space Gray", RAM: "16GB" },
            image: {
              url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800",
            },
          },
        ],
        specifications: [
          { name: "CPU", value: "Apple M2" },
          { name: "Màn hình", value: "Liquid Retina 13.6 inch" },
        ],
        shipping: { weight: 1200 },
      },
      {
        name: "Chuột Logitech MX Master 3S",
        category: CAT_ID.MOUSE_KEYBOARD,
        brand: brandMap["Logitech"],
        price: 2100000,
        originalPrice: 2500000,
        type: "simple",
        stock: 50,
        description: "<p>Chuột công thái học tốt nhất cho dân văn phòng.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800",
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800",
          },
        ],
        shipping: { weight: 300 },
        tags: ["chuột không dây", "logitech", "office"],
      },
      {
        name: "Samsung Galaxy Tab S9 Ultra",
        category: CAT_ID.TABLET,
        brand: brandMap["Samsung"],
        price: 19990000,
        type: "simple",
        stock: 20,
        description: "<p>Máy tính bảng màn hình khổng lồ, kèm bút S-Pen.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800",
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800",
          },
        ],
        shipping: { weight: 800 },
        specifications: [{ name: "Màn hình", value: "14.6 inch AMOLED" }],
      },
      {
        name: "Loa Bluetooth Marshall Stanmore III",
        category: CAT_ID.HEADPHONE,
        brand: brandMap["No Brand"],
        price: 6500000,
        originalPrice: 7000000,
        type: "variable",
        description: "<p>Loa decor cực đẹp, chất âm Marshall huyền thoại.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800",
        },
        attributes: { "Màu sắc": ["Đen", "Kem"] },
        variants: [
          {
            sku: "MAR-BLK",
            price: 6500000,
            stock: 10,
            options: { "Màu sắc": "Đen" },
          },
          {
            sku: "MAR-CRM",
            price: 6700000,
            stock: 8,
            options: { "Màu sắc": "Kem" },
          },
        ],
        shipping: { weight: 3000 },
      },

      // --- THỜI TRANG ---
      {
        name: "Giày Nike Air Jordan 1 High Chicago",
        category: CAT_ID.MENS_SNEAKER,
        brand: brandMap["Nike"],
        price: 4500000,
        type: "variable",
        description: "<p>Huyền thoại trở lại. Phối màu Chicago kinh điển.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=800",
          },
        ],
        attributes: { Size: ["40", "41", "42", "43"] },
        variants: [
          { sku: "JD1-40", price: 4500000, stock: 5, options: { Size: "40" } },
          { sku: "JD1-41", price: 4500000, stock: 5, options: { Size: "41" } },
          { sku: "JD1-42", price: 4500000, stock: 5, options: { Size: "42" } },
          { sku: "JD1-43", price: 4500000, stock: 2, options: { Size: "43" } },
        ],
        shipping: { weight: 1000 },
      },
      {
        name: "Áo Polo Coolmate Công nghệ Excool",
        category: CAT_ID.MENS_SHIRT,
        brand: brandMap["Coolmate"],
        price: 299000,
        originalPrice: 350000,
        type: "variable",
        description: "<p>Thoáng mát, thấm hút mồ hôi, không nhăn.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
        },
        attributes: { Màu: ["Trắng", "Xanh đen"], Size: ["L", "XL"] },
        variants: [
          {
            sku: "POLO-W-L",
            price: 299000,
            stock: 50,
            options: { Màu: "Trắng", Size: "L" },
          },
          {
            sku: "POLO-B-XL",
            price: 299000,
            stock: 50,
            options: { Màu: "Xanh đen", Size: "XL" },
          },
        ],
        shipping: { weight: 200 },
      },
      {
        name: "Váy Hoa Nhí Vintage Dáng Dài",
        category: CAT_ID.WOMENS_DRESS,
        brand: brandMap["No Brand"],
        price: 450000,
        type: "simple",
        stock: 30,
        description: "<p>Váy voan 2 lớp, họa tiết hoa nhí nhẹ nhàng.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800",
        },
        shipping: { weight: 400 },
      },
      {
        name: "Túi Xách Da Công Sở",
        category: CAT_ID.WOMENS_BAG,
        brand: brandMap["No Brand"],
        price: 890000,
        originalPrice: 1200000,
        type: "simple",
        stock: 15,
        description: "<p>Da PU cao cấp, đựng vừa laptop 13 inch.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800",
        },
        shipping: { weight: 800 },
      },
      {
        name: "Giày Cao Gót Mũi Nhọn 7cm",
        category: CAT_ID.WOMENS_HEELS,
        brand: brandMap["No Brand"],
        price: 550000,
        type: "variable",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800",
        },
        attributes: { Màu: ["Đen", "Nude"], Size: ["36", "37"] },
        variants: [
          {
            sku: "HEEL-BLK-36",
            price: 550000,
            stock: 10,
            options: { Màu: "Đen", Size: "36" },
          },
          {
            sku: "HEEL-NUDE-37",
            price: 550000,
            stock: 10,
            options: { Màu: "Nude", Size: "37" },
          },
        ],
        shipping: { weight: 600 },
        description: "<p>Giày cao gót cơ bản, dễ phối đồ.</p>",
      },

      // --- SÁCH & KHÁC ---
      {
        name: "Sách: Đắc Nhân Tâm (Khổ Lớn)",
        category: CAT_ID.BOOKS_SKILL,
        brand: brandMap["Fahasa"],
        price: 89000,
        originalPrice: 120000,
        type: "simple",
        stock: 100,
        description: "<p>Cuốn sách kỹ năng bán chạy nhất mọi thời đại.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800",
        },
        shipping: { weight: 300 },
        tags: ["sách", "kỹ năng sống", "best seller"],
      },
      {
        name: "Sạc Dự Phòng Anker 20000mAh",
        category: CAT_ID.POWERBANK,
        brand: brandMap["No Brand"],
        price: 990000,
        type: "simple",
        stock: 25,
        description: "<p>Sạc nhanh PD 20W, dung lượng khủng.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800",
        },
        shipping: { weight: 450 },
      },
      {
        name: "PC Gaming High End (RTX 4090)",
        category: CAT_ID.PC_GAMING,
        brand: brandMap["No Brand"],
        price: 85000000,
        type: "simple",
        stock: 2,
        description: "<p>Cấu hình khủng long cân mọi game AAA.</p>",
        thumbnail: {
          url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800",
        },
        shipping: { weight: 15000 },
        specifications: [
          { name: "VGA", value: "RTX 4090" },
          { name: "CPU", value: "Core i9 14900K" },
        ],
      },
    ];

    // 5. Format dữ liệu chuẩn Model
    const productsData = productsToSeed.map((p) => ({
      ...p,
      sellerId: SELLER_ID,
      slug: generateSlug(p.name),
      status: "active", // Cho active luôn để hiện lên trang chủ
      isActive: true,
      sold: Math.floor(Math.random() * 500), // Fake số lượng đã bán cho đẹp
      ratingAverage: (Math.random() * 2 + 3).toFixed(1), // Rating từ 3.0 đến 5.0
      reviewCount: Math.floor(Math.random() * 100),

      // Xử lý variantAttributes nếu là variable product
      variantAttributes: p.attributes
        ? Object.keys(p.attributes).map((key) => ({
            name: key,
            values: p.attributes[key],
          }))
        : [],

      // Xử lý thumbnail/images nếu chưa có public_id (để đúng schema)
      thumbnail: p.thumbnail.public_id
        ? p.thumbnail
        : { ...p.thumbnail, public_id: `seed-${Date.now()}` },
      images: p.images
        ? p.images.map((img) => ({ ...img, public_id: `seed-${Date.now()}` }))
        : [{ ...p.thumbnail, public_id: `seed-${Date.now()}` }],
    }));

    // 6. Insert vào DB
    console.log(`📦 Đang thêm ${productsData.length} sản phẩm...`);
    await Product.insertMany(productsData);

    console.log("------------------------------------------");
    console.log("🎉 SEED PRODUCTS THÀNH CÔNG!");
    console.log(`👤 Seller ID: ${SELLER_ID}`);
    console.log(`📦 Số lượng: ${productsData.length} sản phẩm`);
    console.log("------------------------------------------");
  } catch (error) {
    console.error("❌ Lỗi Seed Product:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Đã đóng kết nối.");
    process.exit(0);
  }
};

seedProducts();
