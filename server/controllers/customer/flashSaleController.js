import FlashSale from "../../models/FlashSale.js";

export const getActiveFlashSales = async (req, res) => {
  try {
    const now = new Date();

    const sales = await FlashSale.find({
      status: "approved",
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
      .populate({
        path: "products.product",
        // ⚠️ Quan trọng: Phải lấy cả field 'images' ra
        select:
          "name thumbnail images price original_price slug is_active is_deleted stock",
      })
      .sort({ endTime: 1 });

    const cleanData = sales.reduce((acc, sale) => {
      const validProducts = sale.products.filter((item) => {
        if (!item || !item.product) return false;
        const p = item.product;
        return p.is_active === true && p.is_deleted === false;
      });

      if (validProducts.length > 0) {
        acc.push({
          _id: sale._id,
          title: sale.title,
          startTime: sale.startTime,
          endTime: sale.endTime,
          products: validProducts.map((item) => {
            const prod = item.product;

            // 📸 LOGIC LẤY ẢNH THÔNG MINH (Smart Image Selection)
            let imageUrl = "https://via.placeholder.com/300"; // Ảnh mặc định phòng hờ

            // Ưu tiên 1: Lấy Thumbnail nếu có
            if (prod.thumbnail && prod.thumbnail.url) {
              imageUrl = prod.thumbnail.url;
            }
            // Ưu tiên 2: Nếu không có thumbnail, lấy ảnh đầu tiên trong mảng images
            // 👇 CHÍNH LÀ ĐOẠN NÀY SẼ CỨU BẠN
            else if (prod.images && prod.images.length > 0) {
              imageUrl = prod.images[0].url;
            }

            return {
              _id: prod._id,
              name: prod.name,
              thumbnail: imageUrl, // ✅ Giờ chắc chắn sẽ có link ảnh
              slug: prod.slug,
              originalPrice: prod.original_price,
              salePrice: item.salePrice,
              discountPercent: Math.round(
                ((prod.price - item.salePrice) / prod.price) * 100
              ),
              limitQuantity: item.limitQuantity,
              soldQuantity: item.soldQuantity,
              stock: prod.stock,
            };
          }),
        });
      }
      return acc;
    }, []);

    res.json({ success: true, data: cleanData });
  } catch (error) {
    console.error("Lỗi lấy Flash Sale:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
