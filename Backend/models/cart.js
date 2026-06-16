import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: Number,
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    couponCode: String,
    discountAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Calculate Total ─────────────────────────────────────────────────────────
cartSchema.virtual("total").get(function () {
  return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

export default mongoose.model("Cart", cartSchema);
