const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number, // Price per unit at the time of order
    required: true,
  },
  total: {
    type: Number, // quantity * price
    required: true,
  },
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
