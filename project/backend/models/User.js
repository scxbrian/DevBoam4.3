const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    required: true,
  },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client' 
  }, // Link to a client if role is 'client'
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
