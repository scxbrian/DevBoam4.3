const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
