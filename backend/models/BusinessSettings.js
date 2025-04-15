// models/BusinessSettings.js
const mongoose = require('mongoose');

const businessSettingsSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true
  },
  workingHours: {
    regularHoursPerDay: {
      type: Number,
      default: 8
    },
    workingDaysPerWeek: {
      type: Number,
      default: 6
    },
    overtimeMultiplier: {
      type: Number,
      default: 1.5 // 1.5x for overtime hours
    }
  },
  paymentSettings: {
    salaryCalculationPeriod: {
      type: String,
      enum: ['monthly', 'bi-weekly', 'weekly'],
      default: 'monthly'
    },
    paymentDay: {
      type: Number,
      default: 1 // Day of month for monthly payments
    },
    autoCalculate: {
      type: Boolean,
      default: true
    }
  },
  notificationSettings: {
    enableEmailNotifications: {
      type: Boolean,
      default: true
    },
    notifyOnAttendanceIssues: {
      type: Boolean,
      default: true
    },
    notifyBeforePayday: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BusinessSettings', businessSettingsSchema);