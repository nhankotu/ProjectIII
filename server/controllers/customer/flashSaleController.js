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
        // 👇 SỬA 1: Đổi tên trường sang camelCase (Bỏ dấu gạch dưới)
        select:
          "name thumbnail images price originalPrice slug isActive isDeleted stock",
      })
      .sort({ endTime: 1 });

    const cleanData = sales.reduce((acc, sale) => {
      // 👇 SỬA 2: Lọc sản phẩm phải dùng đúng tên biến isActive/isDeleted
      const validProducts = sale.products.filter((item) => {
        if (!item || !item.product) return false;
        const p = item.product;

        // Kiểm tra an toàn: Nếu isActive undefined thì coi như true (tuỳ logic bạn)
        // Nhưng chuẩn nhất là check: p.isActive === true
        return p.isActive === true && p.isDeleted === false;
      });

      if (validProducts.length > 0) {
        acc.push({
          _id: sale._id,
          title: sale.title,
          startTime: sale.startTime,
          endTime: sale.endTime,
          products: validProducts.map((item) => {
            const prod = item.product;

            // 📸 LOGIC LẤY ẢNH (Đã tối ưu cho cả trường hợp string và object)
            let imageUrl = "https://via.placeholder.com/300";

            if (prod.thumbnail) {
              // Nếu thumbnail là object cloudinary
              if (prod.thumbnail.url) imageUrl = prod.thumbnail.url;
              // Nếu thumbnail là string
              else if (typeof prod.thumbnail === "string")
                imageUrl = prod.thumbnail;
            } else if (prod.images && prod.images.length > 0) {
              // Check an toàn cho images
              imageUrl = prod.images[0].url || prod.images[0];
            }

            return {
              _id: prod._id,
              name: prod.name,
              thumbnail: imageUrl,
              slug: prod.slug,
              // 👇 SỬA 3: Lấy đúng tên field originalPrice. Fallback về price nếu không có.
              originalPrice: prod.originalPrice || prod.price,
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
