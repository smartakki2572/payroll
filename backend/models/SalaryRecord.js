// models/SalaryRecord.js
const mongoose = require('mongoose');

const salaryRecordSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: Number, // 0-11 (January-December)
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  totalWorkingDays: {
    type: Number,
    required: true
  },
  daysWorked: {
    type: Number,
    required: true
  },
  regularHours: {
    type: Number,
    default: 0
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  grossSalary: {
    type: Number,
    required: true
  },
  deductions: {
    advances: {
      type: Number,
      default: 0
    },
    loans: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  netSalary: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentDate: {
    type: Date,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'check', 'other'],
    default: 'cash'
  },
  notes: String,
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the owner's User document
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index for faster queries and to prevent duplicate salary records
salaryRecordSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
salaryRecordSchema.index({ business: 1, month: 1, year: 1 }); // For monthly reports

module.exports = mongoose.model('SalaryRecord', salaryRecordSchema);