const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    description: { type: String },
    image: { type: String }, // Optional: Store category image URL
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
