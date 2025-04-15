// models/SalaryRecord.js
const mongoose = require('mongoose');

const salaryRecordSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  // For instance, store the month as a string (e.g., "2025-02" or "Feb 2025")
  month: {
    type: String,
    required: true,
  },
  overtimeHours: {
    type: Number,
    default: 0,
  },
  debitAmount: {
    type: Number,
    default: 0,
  },
  creditAmount: {
    type: Number,
    default: 0,
  },
  // The total salary could be the sum of various components
  totalSalary: {
    type: Number,
    default: 0,
  },
  // Loan or other deductions
  loan: {
    type: Number,
    default: 0,
  },
  // Advances taken by the employee
  advance: {
    type: Number,
    default: 0,
  },
  // Net salary is the final amount after adjustments
  netSalary: {
    type: Number,
    default: 0,
  },
  // Timestamp for when the record is created or updated
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on every save
salaryRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SalaryRecord', salaryRecordSchema);