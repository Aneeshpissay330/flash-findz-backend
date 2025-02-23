const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String }, // ImageKit URL
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null }, // For subcategories
  status: { type: Boolean, default: true }, // true (active) or false (inactive)
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // User who created the category
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);