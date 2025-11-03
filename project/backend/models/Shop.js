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
    trim: true,
  },
  domain: {
    type: String,
    trim: true,
    unique: true,
    sparse: true, // Allows multiple null values for domain if it's not provided
  },
  designTheme: {
    type: String,
    required: true,
  },
  features: {
    type: Object,
  },
  hostingTier: {
    type: String,
    enum: ['lite', 'core', 'prime', 'titan', 'shop'],
    default: 'shop',
  },
  transactionFee: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Shop', ShopSchema);
