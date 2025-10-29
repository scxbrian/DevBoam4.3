const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: ['shopify', 'woocommerce', 'custom'],
    required: true,
  },
  apiKey: {
    type: String,
  },
  apiSecret: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Shop', ShopSchema);
