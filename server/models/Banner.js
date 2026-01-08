// models/Banner.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      default: "Mua ngay",
    },
    buttonLink: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: "bg-gradient-to-r from-purple-600 to-blue-600",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Banner", bannerSchema);
