import FlashSale from "../../models/FlashSale.js";
import Product from "../../models/Product.js";

// ✅ 1. THÊM HÀM HELPER NÀY ĐỂ FIX LỖI "getProductImage is not defined"
const getProductImage = (product) => {
  if (!product) return null;
  // Nếu ảnh là object (Cloudinary) -> lấy url
  if (product.image && typeof product.image === "object" && product.image.url) {
    return product.image.url;
  }
  // Fallback: Check thumbnail hoặc images array
  return (
    product.thumbnail || (product.images && product.images[0]) || product.image
  );
};

// ➕ Gửi yêu cầu Flash Sale mới
export const createFlashSaleRequest = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { title, startTime, endTime, products } = req.body;

    // 1. Validate dữ liệu đầu vào
    if (!title || !startTime || !endTime || !products?.length) {
      return res
        .status(400)
        .json({
          message: "Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 sản phẩm",
        });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res
        .status(400)
        .json({ message: "Thời gian kết thúc phải sau thời gian bắt đầu" });
    }

    // 2. Validate từng sản phẩm
    const validatedProducts = [];

    for (const item of products) {
      // 🔍 LƯU Ý: Đảm bảo Model Product của bạn có trường 'seller' hoặc 'sellerId'.
      // Ở đây tôi dùng 'seller' (chuẩn thường dùng). Nếu DB bạn là 'sellerId', hãy đổi lại.
      const product = await Product.findOne({
        _id: item.product,
        // seller: sellerId, // Mở comment dòng này nếu muốn check quyền sở hữu
      });

      if (!product) {
        return res.status(400).json({
          message: `Sản phẩm ID ${item.product} không hợp lệ hoặc không tồn tại.`,
        });
      }

      // Check giá giảm
      if (Number(item.salePrice) >= product.price) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}": Giá Sale (${item.salePrice}) phải thấp hơn giá gốc (${product.price}).`,
        });
      }

      // Check tồn kho
      if (Number(item.limitQuantity) > product.stock) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}": Số lượng đăng ký (${item.limitQuantity}) vượt quá tồn kho (${product.stock}).`,
        });
      }

      validatedProducts.push({
        product: product._id,
        originalPrice: product.price,
        salePrice: Number(item.salePrice),
        limitQuantity: Number(item.limitQuantity) || 10,
        soldQuantity: 0,
      });
    }

    // 3. Tạo Flash Sale
    const flashSale = new FlashSale({
      title,
      startTime,
      endTime,
      products: validatedProducts,
      createdBy: sellerId,
      status: "pending",
    });

    await flashSale.save();

    res.status(201).json({
      success: true,
      message:
        "Đã gửi yêu cầu Flash Sale thành công. Vui lòng chờ Admin phê duyệt.",
      data: flashSale,
    });
  } catch (err) {
    console.error("Lỗi tạo Flash Sale:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📋 Lấy danh sách Flash Sale của Seller
export const getSellerFlashSales = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const sales = await FlashSale.find({ createdBy: sellerId })
      .populate({
        path: "products.product",
        select: "name price thumbnail images stock",
      })
      .sort({ createdAt: -1 });

    // Format lại dữ liệu
    const formattedSales = sales.map((sale) => {
      const saleObj = sale.toObject();

      if (saleObj.products && Array.isArray(saleObj.products)) {
        saleObj.products = saleObj.products.map((item) => {
          if (!item.product) return item;

          return {
            ...item,
            product: {
              ...item.product,
              thumbnail: getProductImage(item.product), // ✅ Hàm này giờ đã tồn tại
            },
          };
        });
      }

      return saleObj;
    });

    res.json({ success: true, data: formattedSales });
  } catch (error) {
    console.error("Lỗi getSellerFlashSales:", error); // Log lỗi ra terminal
    res.status(500).json({ message: error.message });
  }
};
