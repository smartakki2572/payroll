// models/AuditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // The collection on which the operation occurred (e.g., 'Employee', 'SalaryRecord', etc.)
  collectionName: {
    type: String,
    required: true,
  },
  // Operation type: CREATE, UPDATE, DELETE, etc.
  operation: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
  },
  // Document ID of the record affected
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // Optionally capture which fields were changed
  changedFields: {
    type: Array,
    default: [],
  },
  // User who performed the operation. Optional but useful for tracking.
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Timestamp for the operation
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Optional: previous data snapshot (if required for rollback or auditing)
  previousData: {
    type: Object,
    default: {},
  },
  // Optional: new data snapshot after the change
  newData: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);