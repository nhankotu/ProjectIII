import FlashSale from "../../models/FlashSale.js";
import Product from "../../models/Product.js";
import mongoose from "mongoose";

// --- HELPER: Xử lý ảnh (Dùng cho hàm getSellerFlashSales sau khi query xong) ---
const getProductImage = (product) => {
  if (!product) return null;
  // Logic lấy ảnh của bạn
  if (product.image && typeof product.image === "object" && product.image.url) {
    return product.image.url;
  }
  return (
    product.thumbnail?.url || // Thêm ?. an toàn
    product.thumbnail ||
    (product.images && product.images[0]?.url) || // Thêm ?. an toàn
    (product.images && product.images[0]) ||
    product.image
  );
};

// ============================================================
// 1. ĐĂNG KÝ SẢN PHẨM VÀO FLASH SALE (Đã Fix Logic Time & Concurrency)
// ============================================================
export const registerProductToFlashSale = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { flashSaleId, productId, salePrice, limitQuantity } = req.body;
    const now = new Date();

    const product = await Product.findOne({
      _id: productId,
      sellerId: sellerId,
      status: "active",
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không hợp lệ hoặc không tồn tại." });
    }

    // 2. Validate Logic giá và kho
    if (Number(salePrice) >= product.price) {
      return res
        .status(400)
        .json({ message: "Giá Sale phải thấp hơn giá gốc." });
    }
    if (Number(limitQuantity) > product.stock) {
      return res
        .status(400)
        .json({ message: "Số lượng đăng ký vượt quá tồn kho hiện có." });
    }

    const result = await FlashSale.updateOne(
      {
        _id: flashSaleId,
        isActive: true,

        startTime: { $gt: now },

        products: {
          $not: {
            $elemMatch: { product: productId, seller: sellerId },
          },
        },
      },
      {
        $push: {
          products: {
            product: productId,
            seller: sellerId,
            originalPrice: product.price,
            salePrice: Number(salePrice),
            limitQuantity: Number(limitQuantity),
            status: "pending", // Mặc định chờ duyệt
            soldQuantity: 0,
          },
        },
      },
    );

    // 4. Kiểm tra kết quả
    if (result.modifiedCount === 0) {
      // Check nhanh để trả về lỗi chi tiết cho user dễ hiểu
      const exists = await FlashSale.findById(flashSaleId);
      if (!exists)
        return res.status(404).json({ message: "Sự kiện không tồn tại." });
      if (exists.startTime <= now)
        return res.status(400).json({
          message: "Sự kiện đã bắt đầu hoặc kết thúc, không thể đăng ký thêm.",
        });

      return res.status(400).json({
        message: "Sản phẩm này bạn đã đăng ký trong khung giờ này rồi.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đăng ký thành công! Vui lòng chờ Admin duyệt.",
    });
  } catch (error) {
    console.error("Lỗi đăng ký FlashSale:", error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// 2. LẤY DANH SÁCH ĐĂNG KÝ CỦA SELLER
// ============================================================
export const getSellerFlashSales = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();

    const registrations = await FlashSale.aggregate([
      { $match: { "products.seller": sellerId } },

      { $unwind: "$products" },

      { $match: { "products.seller": sellerId } },

      { $sort: { startTime: -1 } },

      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          flashSaleId: "$_id",
          flashSaleTitle: "$title",
          startTime: "$startTime",
          endTime: "$endTime",

          eventStatus: {
            $switch: {
              branches: [
                { case: { $gt: ["$startTime", now] }, then: "upcoming" },

                { case: { $lt: ["$endTime", now] }, then: "ended" },
              ],

              default: "happening",
            },
          },

          salePrice: "$products.salePrice",
          limitQuantity: "$products.limitQuantity",
          soldQuantity: "$products.soldQuantity",
          status: "$products.status",
          rejectReason: "$products.rejectReason",

          productId: { $ifNull: ["$productInfo._id", null] },
          productName: {
            $ifNull: ["$productInfo.name", "Sản phẩm đã bị xóa khỏi hệ thống"],
          },
          productRawInfo: "$productInfo",
        },
      },
    ]);

    const finalResult = registrations.map((item) => {
      const imageUrl = getProductImage(item.productRawInfo);
      delete item.productRawInfo;
      return { ...item, productImage: imageUrl };
    });

    res.json({ success: true, data: finalResult });
  } catch (error) {
    console.error("Lỗi lấy danh sách FlashSale Seller:", error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// 3. API Lấy các FlashSale đang khả dụng (Giữ nguyên)
// ============================================================
export const getAvailableFlashSales = async (req, res) => {
  try {
    const now = new Date();

    const sales = await FlashSale.find({
      isActive: true,
      endTime: { $gt: now },
    })
      .select("title startTime endTime image")
      .sort({ startTime: 1 });

    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
