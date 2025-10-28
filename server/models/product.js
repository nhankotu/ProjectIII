import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    stock: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "out_of_stock", "low_stock"], // Cập nhật enum values
      default: "pending",
    },
    images: [
      {
        url: String,
        public_id: String,
        secure_url: String,
      },
    ],
    videos: [
      {
        url: String,
        public_id: String,
        secure_url: String,
      },
    ],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
