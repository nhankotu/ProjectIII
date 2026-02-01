import FlashSale from "../../models/FlashSale.js";
import Product from "../../models/Product.js";

export const getActiveFlashSales = async (req, res) => {
  try {
    const now = new Date();

    // 1. Tìm các khung giờ chưa kết thúc và đang được Admin bật
    const sales = await FlashSale.find({
      isActive: true,
      endTime: { $gt: now },
    })
      .populate({
        path: "products.product",
        // 🔥 FIX: Thay isActive, isDeleted bằng trường 'status' theo Model mới
        select: "name thumbnail images price slug status stock",
      })
      .sort({ startTime: 1 });

    // 2. Xử lý dữ liệu (Lọc và Định dạng)
    const cleanData = sales.reduce((acc, sale) => {
      const validProducts = sale.products.filter((item) => {
        const prod = item.product;

        // 🔥 FIX LOGIC:
        // - Sản phẩm phải tồn tại (hasProduct)
        // - Trạng thái sản phẩm gốc phải là 'active' (theo Model mới)
        // - Sản phẩm đăng ký Flash Sale này đã được Admin duyệt (status === 'approved')
        return prod && prod.status === "active" && item.status === "approved";
      });

      if (validProducts.length > 0) {
        const formattedProducts = validProducts.map((item) => {
          const prod = item.product;

          // Logic xử lý ảnh thumbnail từ object { url, public_id }
          const imageUrl =
            prod.thumbnail?.url ||
            (prod.images?.length > 0
              ? prod.images[0].url
              : "https://via.placeholder.com/300");

          return {
            productId: prod._id,
            name: prod.name,
            slug: prod.slug,
            thumbnail: imageUrl,
            originalPrice: prod.price,
            salePrice: item.salePrice,
            discountPercent:
              prod.price > 0
                ? Math.round(((prod.price - item.salePrice) / prod.price) * 100)
                : 0,
            soldQuantity: item.soldQuantity,
            limitQuantity: item.limitQuantity,
            isStarted: sale.startTime <= now,
          };
        });

        acc.push({
          flashSaleId: sale._id,
          title: sale.title,
          startTime: sale.startTime,
          endTime: sale.endTime,
          image: sale.image,
          products: formattedProducts,
        });
      }
      return acc;
    }, []);

    res.json({ success: true, data: cleanData });
  } catch (error) {
    console.error("❌ getActiveFlashSales Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
