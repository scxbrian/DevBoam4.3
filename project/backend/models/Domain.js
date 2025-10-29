
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const domainSchema = new Schema({
  domain: {
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
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Domain', domainSchema);
