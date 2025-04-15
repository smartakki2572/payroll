// models/Advance.js
const mongoose = require('mongoose');

const advanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['advance', 'loan'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: String,
  // For loans with installments
  installments: {
    total: {
      type: Number,
      default: 1
    },
    paid: {
      type: Number,
      default: 0
    },
    amountPerInstallment: {
      type: Number,
      default: function() { return this.amount; } // Full amount by default
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'partially_paid'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the owner's User document
    required: true
  }
}, {
  timestamps: true
});

advanceSchema.index({ employee: 1, status: 1 });
advanceSchema.index({ business: 1, date: 1 });

module.exports = mongoose.model('Advance', advanceSchema);