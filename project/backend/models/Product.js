const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  comparePrice: {
    type: Number,
  },
  cost: {
    type: Number,
  },
  sku: {
    type: String,
    trim: true,
  },
  inventory: {
    type: Number,
    required: true,
    default: 0
  },
  images: [{
    type: String, // Array of image URLs
  }],
  category: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  variants: {
    type: Object,
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active',
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', ProductSchema);
