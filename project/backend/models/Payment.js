const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'KES',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  provider: {
    type: String,
    enum: ['mpesa', 'paystack', 'stripe', 'manual'],
    required: true,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  providerReference: {
    type: String,
  },
  verificationData: {
    type: Object,
  },
  verifiedAt: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
