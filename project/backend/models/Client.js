
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Client', clientSchema);
