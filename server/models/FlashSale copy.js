import mongoose from "mongoose";

const flashSaleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    image: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: { type: Boolean, default: true },
    rejectReason: String,

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        originalPrice: Number,
        salePrice: { type: Number, required: true },
        limitQuantity: { type: Number, default: 10 },
        soldQuantity: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("FlashSale", flashSaleSchema);
