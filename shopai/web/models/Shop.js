import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
  {
    shop: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    installedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shop", ShopSchema);