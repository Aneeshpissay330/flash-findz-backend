const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }], // Array of ImageKit URLs
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, default: 0 },
  status: { type: Boolean, default: true }, // Active (true) or Inactive (false)
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Automatically set from authMiddleware
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
