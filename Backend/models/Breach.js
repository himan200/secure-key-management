const mongoose = require('mongoose');

const BreachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  domain: String,
  breachDate: {
    type: Date,
    required: true
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  description: String,
  dataClasses: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  isFabricated: {
    type: Boolean,
    default: false
  },
  isSensitive: {
    type: Boolean,
    default: false
  },
  isRetired: {
    type: Boolean,
    default: false
  },
  isSpamList: {
    type: Boolean,
    default: false
  },
  emails: [String]
});

// Index for faster email searches
BreachSchema.index({ emails: 1 });

module.exports = mongoose.model('Breach', BreachSchema);
