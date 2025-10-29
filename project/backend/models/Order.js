
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['completed', 'pending', 'cancelled'], default: 'pending' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
