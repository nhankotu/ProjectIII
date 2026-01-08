import Cart from "../../models/Cart.js";
import Product from "../../models/A.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // 1. Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    // 2. Check product
    const product = await Product.findById(productId);
    if (
      !product ||
      product.isDeleted ||
      !product.isActive ||
      product.status !== "active"
    ) {
      return res.status(404).json({ message: "Sản phẩm không còn kinh doanh" });
    }

    // 3. Check stock
    if (quantity > product.stock) {
      return res
        .status(400)
        .json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });
    }

    // 4. Find cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;

        if (newQuantity > product.stock) {
          return res.status(400).json({ message: "Số lượng vượt quá tồn kho" });
        }

        cart.items[itemIndex].quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: "Đã thêm vào giỏ hàng",
      data: cart,
    });
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: "items.product",
      select:
        "name price originalPrice slug stock thumbnail images sellerId isActive isDeleted status",
      populate: { path: "sellerId", select: "username avatar" },
    });

    if (!cart) {
      return res.json({
        success: true,
        data: { items: [] },
        totalAmount: 0,
      });
    }

    // 1. Lọc sản phẩm hợp lệ
    const validItems = cart.items.filter((item) => {
      const p = item.product;
      return p && p.isActive && !p.isDeleted && p.status === "active";
    });

    // 2. Map dữ liệu trả FE
    const items = validItems.map((item) => {
      const p = item.product;

      let imageUrl = "https://via.placeholder.com/150";
      if (p.thumbnail?.url) imageUrl = p.thumbnail.url;
      else if (p.images?.length) imageUrl = p.images[0].url;

      return {
        _id: item._id,
        quantity: item.quantity,
        totalPrice: p.price * item.quantity,
        product: {
          _id: p._id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          originalPrice: p.originalPrice,
          stock: p.stock,
          thumbnail: imageUrl,
          seller: p.sellerId,
        },
      };
    });

    // 3. Tính tổng tiền
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    // 4. OPTIONAL: làm sạch DB (khuyến nghị)
    cart.items = validItems;
    await cart.save();

    res.json({
      success: true,
      data: {
        _id: cart._id,
        items,
      },
      totalAmount,
    });
  } catch (error) {
    console.error("getCart error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();

    res.json({ success: true, message: "Đã xóa sản phẩm" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    const cart = await Cart.findOne({
      userId,
      "items._id": itemId,
    }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Item không tồn tại" });
    }

    const item = cart.items.find((i) => i._id.toString() === itemId);

    if (quantity > item.product.stock) {
      return res.status(400).json({ message: "Vượt quá tồn kho cho phép" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({ success: true, message: "Đã cập nhật số lượng" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
