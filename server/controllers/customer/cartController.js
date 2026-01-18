import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

/* =========================================================
   1. ADD TO CART
   ========================================================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // Lấy từ middleware auth

    // 1. Validate đầu vào
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    // 2. Kiểm tra sản phẩm có tồn tại và còn bán không
    const product = await Product.findById(productId);
    if (
      !product ||
      product.isDeleted ||
      !product.isActive ||
      product.status !== "active"
    ) {
      return res.status(404).json({ message: "Sản phẩm không còn kinh doanh" });
    }

    // 3. Kiểm tra tồn kho (Optional: Có thể bỏ qua nếu muốn cho đặt trước)
    if (quantity > product.stock) {
      return res
        .status(400)
        .json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });
    }

    // 4. Tìm giỏ hàng của User
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Nếu chưa có giỏ -> Tạo mới
      cart = new Cart({
        userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Nếu đã có giỏ -> Tìm xem sản phẩm đã có chưa
      // 🔥 LƯU Ý: So sánh bằng toString() để đảm bảo chính xác
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Sản phẩm đã có -> Cộng dồn số lượng
        const newQuantity = cart.items[itemIndex].quantity + quantity;

        // Check lại tồn kho sau khi cộng dồn
        if (newQuantity > product.stock) {
          return res.status(400).json({ message: "Số lượng vượt quá tồn kho" });
        }

        cart.items[itemIndex].quantity = newQuantity;
      } else {
        // Sản phẩm chưa có -> Push vào mảng
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.json({ success: true, message: "Đã thêm vào giỏ hàng", data: cart });
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   2. GET CART
   ========================================================= */
export const getCart = async (req, res) => {
  try {
    // Populate để lấy thông tin chi tiết sản phẩm hiển thị ra Frontend
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: "items.product",
      select:
        "name price originalPrice slug stock thumbnail images sellerId isActive isDeleted status",
      populate: { path: "sellerId", select: "username avatar" },
    });

    if (!cart) {
      return res.json({ success: true, data: { items: [] }, totalAmount: 0 });
    }

    // Lọc bỏ các sản phẩm đã bị xóa hoặc ẩn khỏi hệ thống
    const validItems = cart.items.filter((item) => {
      const p = item.product;
      // Kiểm tra p tồn tại (tránh lỗi null) và trạng thái active
      return p && p.isActive && !p.isDeleted && p.status === "active";
    });

    // Map dữ liệu cho đẹp để trả về Frontend
    const items = validItems.map((item) => {
      const p = item.product;
      let imageUrl = "https://via.placeholder.com/150";
      if (p.thumbnail?.url) imageUrl = p.thumbnail.url;
      else if (p.images?.length) imageUrl = p.images[0].url;

      return {
        _id: item._id, // ID của dòng item trong giỏ (Cart Item ID)
        quantity: item.quantity,
        totalPrice: (p.price || 0) * item.quantity,
        product: {
          _id: p._id, // 🔥 ID SẢN PHẨM GỐC
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

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    // (Tùy chọn) Cập nhật lại giỏ hàng trong DB nếu có sản phẩm rác bị lọc bỏ
    if (cart.items.length !== validItems.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json({
      success: true,
      data: { _id: cart._id, items },
      totalAmount,
    });
  } catch (error) {
    console.error("getCart error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   3. UPDATE CART ITEM (SỬA LỖI 404 CỦA BẠN TẠI ĐÂY)
   ========================================================= */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // console.log("🔄 Update Req:", { userId, productId, quantity }); // Debug

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    // 1. Tìm giỏ hàng (KHÔNG DÙNG POPULATE ĐỂ SO SÁNH ID CHÍNH XÁC)
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // 2. Tìm vị trí item bằng cách so sánh chuỗi ID
    // Trong schema: item.product là ObjectId
    // productId gửi lên là String -> Cần .toString() để so sánh
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      console.log("❌ Không tìm thấy ProductID trong giỏ:", productId);
      // console.log("🛒 Items hiện có:", cart.items);
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    // 3. Cập nhật
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json({ success: true, message: "Đã cập nhật số lượng" });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   4. REMOVE FROM CART
   ========================================================= */
export const removeFromCart = async (req, res) => {
  try {
    const { itemId: productId } = req.params; // Nhận Product ID từ URL
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Lọc bỏ sản phẩm có ID trùng khớp
    const newItems = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.items = newItems;
    await cart.save();

    res.json({ success: true, message: "Đã xóa sản phẩm" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
