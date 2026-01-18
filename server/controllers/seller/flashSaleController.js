import FlashSale from "../../models/FlashSale.js";
import Product from "../../models/Product.js";

const getProductImage = (product) => {
  if (!product) return null;
  if (product.image && typeof product.image === "object" && product.image.url) {
    return product.image.url;
  }
  return (
    product.thumbnail || (product.images && product.images[0]) || product.image
  );
};

export const getAvailableFlashSales = async (req, res) => {
  try {
    // Lấy các Flash Sale chưa kết thúc (endTime > hiện tại) và đang Active
    const sales = await FlashSale.find({
      isActive: true,
      endTime: { $gt: new Date() },
    }).select("title startTime endTime image");

    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerProductToFlashSale = async (req, res) => {
  try {
    const sellerId = req.user._id;
    // req.body cần: flashSaleId, productId, salePrice, limitQuantity
    const { flashSaleId, productId, salePrice, limitQuantity } = req.body;

    // 1. Kiểm tra Flash Sale có tồn tại và còn hạn không
    const flashSale = await FlashSale.findOne({
      _id: flashSaleId,
      isActive: true,
      endTime: { $gt: new Date() }, // Không thể đăng ký sự kiện đã qua
    });

    if (!flashSale) {
      return res.status(404).json({
        message: "Sự kiện Flash Sale không tồn tại hoặc đã kết thúc.",
      });
    }

    // 2. Validate Sản phẩm (Thuộc về Seller này?)
    const product = await Product.findOne({
      _id: productId,
      // seller: sellerId // Bỏ comment dòng này nếu DB Product có field seller
    });

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    // 3. Validate Giá và Kho
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

    // 4. Kiểm tra xem sản phẩm này đã đăng ký trong sự kiện này chưa?
    const isRegistered = flashSale.products.some(
      (item) =>
        item.product.toString() === productId &&
        item.seller.toString() === sellerId.toString()
    );

    if (isRegistered) {
      return res.status(400).json({
        message: "Bạn đã đăng ký sản phẩm này trong khung giờ này rồi.",
      });
    }

    // 5. PUSH vào mảng products
    flashSale.products.push({
      product: productId,
      seller: sellerId, // QUAN TRỌNG: Để biết của ai
      originalPrice: product.price,
      salePrice: Number(salePrice),
      limitQuantity: Number(limitQuantity),
      status: "pending", // Mặc định chờ duyệt
    });

    await flashSale.save();

    res.status(200).json({
      success: true,
      message: "Đăng ký thành công! Vui lòng chờ Admin duyệt.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 📋 Lấy danh sách Flash Sale của Seller
export const getSellerFlashSales = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1. Tìm tất cả FlashSale mà Seller này có tham gia
    const sales = await FlashSale.find({
      "products.seller": sellerId,
    })
      .populate({
        path: "products.product",
        select: "name price thumbnail images",
      })
      .sort({ startTime: -1 });

    // 2. Format dữ liệu: Chỉ lấy ra những dòng product của Seller này
    // (Vì FlashSale chứa product của nhiều người khác nữa)
    const myRegistrations = [];

    sales.forEach((sale) => {
      // Lọc ra item của mình
      const myItems = sale.products.filter(
        (item) => item.seller && item.seller.toString() === sellerId.toString()
      );

      myItems.forEach((item) => {
        // Xử lý ảnh
        const prod = item.product;
        let imageUrl = null;
        if (prod) imageUrl = getProductImage(prod);

        myRegistrations.push({
          flashSaleId: sale._id,
          flashSaleTitle: sale.title,
          startTime: sale.startTime,
          endTime: sale.endTime,

          // Thông tin đăng ký
          productId: prod ? prod._id : null,
          productName: prod ? prod.name : "Sản phẩm đã xóa",
          productImage: imageUrl,
          salePrice: item.salePrice,
          limitQuantity: item.limitQuantity,
          soldQuantity: item.soldQuantity,
          status: item.status, // pending, approved, rejected
          rejectReason: item.rejectReason,
        });
      });
    });

    res.json({ success: true, data: myRegistrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
