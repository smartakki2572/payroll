// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  clockIn: {
    type: Date,
    required: true
  },
  clockOut: {
    type: Date,
    default: null // Set when employee clocks out
  },
  hoursWorked: {
    type: Number,
    default: 0 // Calculated when clock-out occurs
  },
  overtimeHours: {
    type: Number,
    default: 0 // Calculated based on regular hours threshold (e.g., > 8hrs)
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave', 'half-day'],
    default: 'present'
  },
  notes: String,
  // For tracking who recorded this attendance (owner or system)
  recordedBy: {
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

// Compound index for faster queries and to prevent duplicate attendance records
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ business: 1, date: 1 }); // For reports per business

module.exports = mongoose.model('Attendance', attendanceSchema);