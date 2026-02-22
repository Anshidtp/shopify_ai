import mongoose from "mongoose";

const TargetingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["all", "products", "collections"],
      default: "all",
    },
    resourceIds: [{ type: String }], // Shopify product/collection GIDs
  },
  { _id: false }
);

const AppearanceSchema = new mongoose.Schema(
  {
    backgroundColor: { type: String, default: "#FF4444" },
    textColor: { type: String, default: "#FFFFFF" },
    position: { type: String, enum: ["top", "bottom"], default: "top" },
    headline: { type: String, default: "Sale Ends In", maxlength: 60 },
    supportingText: { type: String, default: "", maxlength: 120 },
  },
  { _id: false }
);

const TimerSchema = new mongoose.Schema(
  {
    shop: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ["fixed", "evergreen"],
      required: true,
    },
    // Fixed timer fields
    startDate: { type: Date },
    endDate: { type: Date },
    // Evergreen timer fields
    durationHours: { type: Number, min: 0.1, max: 720 },

    targeting: {
      type: TargetingSchema,
      default: () => ({ type: "all", resourceIds: [] }),
    },
    appearance: {
      type: AppearanceSchema,
      default: () => ({}),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual: compute status
TimerSchema.virtual("status").get(function () {
  if (!this.isActive) return "disabled";
  if (this.type === "evergreen") return "active";
  const now = new Date();
  if (this.startDate && now < this.startDate) return "scheduled";
  if (this.endDate && now > this.endDate) return "expired";
  return "active";
});

TimerSchema.set("toJSON", { virtuals: true });

// Index for widget queries (most frequent query)
TimerSchema.index({ shop: 1, isActive: 1 });

export default mongoose.model("Timer", TimerSchema);