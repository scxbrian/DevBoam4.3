const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null emails
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
}, { timestamps: true });

// Compound index to ensure email is unique per client
CustomerSchema.index({ client: 1, email: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Customer', CustomerSchema);
