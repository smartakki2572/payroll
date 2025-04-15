// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  overtimeRate: {
    type: Number,
    default: 0 // Can be set to 1.5x hourly rate by default in business logic
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null // For non-permanent employees who leave
  },
  isActive: {
    type: Boolean,
    default: true
  },
  contactNumber: String,
  emergencyContact: String,
  address: String,
  notes: String,
  // Store a reference to the business/owner
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the owner's User document
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
employeeSchema.index({ business: 1, isActive: 1 });
employeeSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Employee', employeeSchema);