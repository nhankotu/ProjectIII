import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    sku: {
      type: String,
      default: null,
    },

    variantOptions: {
      type: Object, // Lưu: { "Màu": "Đỏ", "Size": "L" }
      default: {},
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 User chỉ có 1 Cart
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Tính tổng tiền ảo (Chỉ để tham khảo, nên tính ở Controller/Frontend chính xác hơn)
cartSchema.virtual("totalPrice").get(function () {
  if (!this.items) return 0;
  return this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

// Tính tổng số lượng items (VD: icon giỏ hàng hiện số 5)
cartSchema.virtual("totalQty").get(function () {
  if (!this.items) return 0;
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
