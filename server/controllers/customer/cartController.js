import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import FlashSale from "../../models/FlashSale.js";
/* =========================================================
   1. ADD TO CART (Hỗ trợ Biến thể & Sản phẩm đơn giản)
   ========================================================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, variantId } = req.body;
    const userId = req.user._id;

    // 1. Tìm thông tin sản phẩm gốc
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    // 2. 🔥 LOGIC THEN CHỐT: KIỂM TRA GIÁ FLASH SALE HIỆN TẠI
    let finalPrice = product.price; // Mặc định là giá gốc
    const now = new Date();

    const activeCampaign = await FlashSale.findOne({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
      "products.product": productId,
    });

    if (activeCampaign) {
      const saleInfo = activeCampaign.products.find(
        (item) =>
          item.product.toString() === productId.toString() &&
          item.status === "approved",
      );
      if (saleInfo) {
        finalPrice = saleInfo.salePrice; // Sử dụng giá sale nếu thỏa mãn điều kiện
      }
    }

    // 3. Nếu là sản phẩm có biến thể, ghi đè giá bằng giá biến thể (nếu không có Flash Sale)
    // Lưu ý: Nếu Flash Sale áp dụng cho sản phẩm chính, thường nó sẽ ghi đè cả giá biến thể.
    // Tùy logic kinh doanh, ở đây tôi ưu tiên Flash Sale trước.
    if (!activeCampaign && variantId && product.type === "variable") {
      const variant = product.variants.id(variantId);
      if (variant) finalPrice = variant.price;
    }

    // 4. Tìm giỏ hàng của User
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Tạo giỏ mới nếu chưa có
      cart = new Cart({
        userId,
        items: [
          {
            product: productId,
            quantity,
            variantId,
            price: finalPrice, // 🔥 Lưu giá tại thời điểm thêm vào
          },
        ],
      });
    } else {
      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          (!variantId || item.variantId?.toString() === variantId?.toString()),
      );

      if (itemIndex > -1) {
        // Cập nhật số lượng và cập nhật lại giá mới nhất
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = finalPrice;
      } else {
        // Thêm sản phẩm mới vào mảng items
        cart.items.push({
          product: productId,
          quantity,
          variantId,
          price: finalPrice,
        });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   2. GET CART (Lấy giỏ hàng & Lọc sản phẩm lỗi)
   ========================================================= */
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.product",
      select:
        "name price originalPrice slug stock thumbnail images sellerId isActive isDeleted status type variants",
      populate: { path: "sellerId", select: "username avatar" },
    });

    if (!cart) {
      return res.json({ success: true, data: { items: [] }, totalAmount: 0 });
    }

    // 🔥 TỐI ƯU: Lấy tất cả chiến dịch Flash Sale đang diễn ra một lần duy nhất
    const activeFlashSales = await FlashSale.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    });

    const validItems = [];

    for (const item of cart.items) {
      const p = item.product;
      if (
        !p ||
        p.isActive === false ||
        p.isDeleted === true ||
        p.status !== "active"
      ) {
        continue;
      }

      // 1. Lấy giá mặc định (giá gốc hoặc giá biến thể)
      let currentPrice = p.price;
      let originalPrice = p.price;
      let currentStock = p.stock;
      let currentImage = p.thumbnail?.url || p.thumbnail || "";
      let isInvalid = false;
      let isFlashSaleItem = false;

      // Xử lý giá nếu là Biến thể (SKU)
      if (item.sku) {
        const variantInDb = p.variants?.find((v) => v.sku === item.sku);
        if (variantInDb) {
          currentPrice = variantInDb.price;
          originalPrice = variantInDb.price;
          currentStock = variantInDb.stock;
          if (variantInDb.image?.url) currentImage = variantInDb.image.url;
        } else {
          isInvalid = true;
          currentStock = 0;
        }
      }

      // 2. 🔥 LOGIC KIỂM TRA FLASH SALE (GHI ĐÈ GIÁ)
      // Tìm xem sản phẩm này có nằm trong bất kỳ campaign đang chạy nào không
      for (const sale of activeFlashSales) {
        const saleInfo = sale.products.find(
          (sp) =>
            sp.product.toString() === p._id.toString() &&
            sp.status === "approved",
        );

        if (saleInfo) {
          currentPrice = saleInfo.salePrice; // Ghi đè bằng giá sale
          isFlashSaleItem = true;
          break; // Tìm thấy rồi thì thoát vòng lặp sale
        }
      }

      validItems.push({
        _id: item._id,
        quantity: item.quantity,
        sku: item.sku,
        variantOptions: item.variantOptions,
        totalPrice: currentPrice * item.quantity, // Tính dựa trên giá cuối cùng
        isInvalid: isInvalid,
        isFlashSale: isFlashSaleItem, // Báo cho FE biết đây là hàng sale
        product: {
          _id: p._id,
          name: p.name,
          slug: p.slug,
          price: currentPrice, // Giá hiển thị (đã giảm nếu có sale)
          originalPrice: originalPrice, // Giá gốc (để FE gạch ngang)
          stock: currentStock,
          thumbnail: currentImage,
          seller: p.sellerId,
          type: p.type,
        },
      });
    }

    const totalAmount = validItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    res.json({
      success: true,
      data: { _id: cart._id, items: validItems },
      totalAmount,
    });
  } catch (error) {
    console.error("❌ getCart Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   3. UPDATE CART ITEM (Cập nhật số lượng theo ItemID)
   ========================================================= */
export const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body; // itemId là _id của dòng trong giỏ hàng
    const userId = req.user._id;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng rỗng" });

    // Tìm subdocument item trong mảng items
    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });
    }

    item.quantity = quantity;

    await cart.save();
    res.json({ success: true, message: "Đã cập nhật số lượng" });
  } catch (error) {
    console.error("updateCartItem error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   4. REMOVE FROM CART (Xóa sản phẩm theo ItemID)
   ========================================================= */
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng rỗng" });

    cart.items.pull(itemId);

    await cart.save();
    res.json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" });
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.status(500).json({ message: error.message });
  }
};
/* =========================================================
   5. CLEAR CART (Xóa toàn bộ giỏ hàng)
   ========================================================= */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng rỗng" });

    // Set mảng items về rỗng
    cart.items = [];

    await cart.save();
    res.json({ success: true, message: "Đã xóa toàn bộ giỏ hàng" });
  } catch (error) {
    console.error("clearCart error:", error);
    res.status(500).json({ message: error.message });
  }
};
