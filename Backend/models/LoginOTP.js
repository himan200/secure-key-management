const mongoose = require('mongoose');

const loginOTPSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index, auto-delete after expiry
  }
});

module.exports = mongoose.model('LoginOTP', loginOTPSchema);
