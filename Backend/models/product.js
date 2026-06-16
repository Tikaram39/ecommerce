import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: { type: Number, default: 0 },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Electronics",
        "Fashion",
        "Gadgets",
        "Home Appliances",
        "Accessories",
        "Books",
        "Sports",
        "Beauty",
      ],
    },
    brand: { type: String, required: true },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    tags: [String],
    specifications: [{ key: String, value: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ─── Full Text Search Index ──────────────────────────────────────────────────
productSchema.index({ name: "text", description: "text", brand: "text" });

export default mongoose.model("Product", productSchema);
