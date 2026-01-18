import FlashSale from "../../models/FlashSale.js";

export const getActiveFlashSales = async (req, res) => {
  try {
    const now = new Date();

    // 1. Tìm các khung giờ đang diễn ra (Active & Time match)
    // ❌ KHÔNG query { status: "approved" } ở đây nữa vì field đó đã chuyển vào trong mảng products
    const sales = await FlashSale.find({
      isActive: true,
      startTime: { $lte: now }, // Đã bắt đầu
      endTime: { $gte: now }, // Chưa kết thúc
    })
      .populate({
        path: "products.product",
        // Chỉ lấy các field cần thiết để hiển thị Card sản phẩm
        select: "name thumbnail images price slug isActive isDeleted stock",
      })
      .sort({ endTime: 1 }); // Ưu tiên cái nào sắp hết giờ lên trước

    // 2. Xử lý dữ liệu (Filter & Map)
    const cleanData = sales.reduce((acc, sale) => {
      // Lọc ra các sản phẩm hợp lệ trong khung giờ này
      const validProducts = sale.products.filter((item) => {
        // a. Phải có liên kết sản phẩm thực tế
        if (!item.product) return false;

        const prod = item.product;

        // b. Sản phẩm gốc phải đang hoạt động (không bị xóa/ẩn)
        if (!prod.isActive || prod.isDeleted) return false;

        // c. QUAN TRỌNG: Sản phẩm đăng ký này PHẢI ĐƯỢC ADMIN DUYỆT
        // (Theo Model mới, status nằm trong item chứ không phải sale)
        if (item.status !== "approved") return false;

        return true;
      });

      // Nếu khung giờ này có sản phẩm hợp lệ thì mới đẩy vào kết quả
      if (validProducts.length > 0) {
        // Map lại dữ liệu cho đẹp
        const formattedProducts = validProducts.map((item) => {
          const prod = item.product;

          // --- Logic xử lý ảnh (như bạn đã làm) ---
          let imageUrl = "https://via.placeholder.com/300";
          if (prod.thumbnail) {
            if (prod.thumbnail.url) imageUrl = prod.thumbnail.url;
            else if (typeof prod.thumbnail === "string")
              imageUrl = prod.thumbnail;
          } else if (prod.images && prod.images.length > 0) {
            imageUrl = prod.images[0].url || prod.images[0];
          }

          // Tính toán phần trăm giảm giá hiển thị
          // Dùng giá gốc hiện tại của sản phẩm (prod.price) so với giá sale
          const discountPercent =
            prod.price > 0
              ? Math.round(((prod.price - item.salePrice) / prod.price) * 100)
              : 0;

          return {
            productId: prod._id, // ID sản phẩm gốc (để click vào xem chi tiết)
            name: prod.name,
            slug: prod.slug,
            thumbnail: imageUrl,

            // Giá hiển thị
            originalPrice: prod.price, // Giá gạch ngang (Giá thị trường hiện tại)
            salePrice: item.salePrice, // Giá Flash Sale (Giá bán)
            discountPercent: discountPercent,

            // Thông tin bán hàng Flash Sale
            limitQuantity: item.limitQuantity, // Tổng slot
            soldQuantity: item.soldQuantity, // Đã bán (để làm thanh progress bar)
            stock: prod.stock, // Tồn kho thực tế (để chặn mua nếu kho hết trước limit)
          };
        });

        acc.push({
          flashSaleId: sale._id,
          title: sale.title,
          startTime: sale.startTime,
          endTime: sale.endTime,
          image: sale.image, // Banner của khung giờ (nếu có)
          products: formattedProducts,
        });
      }

      return acc;
    }, []);

    res.json({ success: true, data: cleanData });
  } catch (error) {
    console.error("Lỗi lấy Flash Sale (Customer):", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
