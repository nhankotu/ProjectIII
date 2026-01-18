import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      // Chủ ví (Shop hoặc Admin)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAW", "PAYMENT", "REFUND", "FEE"], // FEE: Phí sàn thu
      required: true,
    },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true }, // Số dư trước GD
    balanceAfter: { type: Number, required: true }, // Số dư sau GD
    description: String,
    relatedId: {
      // Ref tới Order hoặc Yêu cầu rút tiền
      type: mongoose.Schema.Types.ObjectId,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      enum: ["Order", "BankRequest"],
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "COMPLETED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
