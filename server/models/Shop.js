// models/Shop.js
import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String },
    logo: { type: String },


    status: {
      type: String,
      enum: ["pending", "active", "rejected", "banned"],
      default: "pending", 
    },


    paymentInfo: {
      bankName: String,
      accountNumber: String,
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
