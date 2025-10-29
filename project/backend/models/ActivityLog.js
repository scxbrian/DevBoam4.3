const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  action: {
    type: String,
    required: true, // e.g., 'order_created', 'client_updated'
  },
  entityType: {
    type: String, // e.g., 'Order', 'Client'
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  details: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
