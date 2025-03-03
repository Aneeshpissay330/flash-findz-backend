const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    name: { type: String, required: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    discount: {
      percentage: { type: Number, default: 0 },
      validTill: Date,
    },
    stock: { type: Number, required: true },
    images: [String],
    sku: { type: String, unique: true },
    status: { type: String, enum: ["available", "out_of_stock", "discontinued"], default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
