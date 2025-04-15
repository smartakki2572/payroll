// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  // Additional fields like department, position, etc.
  department: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: '',
  },
  // Link to salary records
  salaryRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalaryRecord',
  }],
});

module.exports = mongoose.model('Employee', employeeSchema);