// routes/leaves.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, ownerAuth } = require('../middleware/auth');
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @route   GET /api/leaves
// @desc    Get all leaves for a business
// @access  Private (owner/manager)
router.get('/', auth, async (req, res) => {
  try {
    // Check authorization
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const businessId = user.role === 'owner' ? user._id : user.business;
    
    // Parse query parameters
    const { status, type, startDate, endDate } = req.query;
    
    // Build query
    const query = { business: businessId };
    
    if (status) query.status = status;
    if (type) query.type = type;
    
    if (startDate || endDate) {
      if (startDate) {
        query.endDate = { $gte: new Date(startDate) };
      }
      if (endDate) {
        query.startDate = { $lte: new Date(endDate) };
      }
    }
    
    // Get leaves
    const leaves = await Leave.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName position'
      })
      .sort({ startDate: -1 });
    
    res.json(leaves);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/leaves/employee/:employeeId
// @desc    Get leaves for an employee
// @access  Private (owner/manager/self)
router.get('/employee/:employeeId', auth, async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Check authorization
    const user = await User.findById(req.user.id);
    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    
    // Allow access to owners, managers of the business, or the employee themselves
    let authorized = false;
    if (user.role === 'owner' && employee.business.toString() === user._id.toString()) {
      authorized = true;
    } else if (user.role === 'manager' && employee.business.toString() === user.business.toString()) {
      authorized = true;
    } else if (employee.user.toString() === user._id.toString()) {
      // Employee accessing their own records
      authorized = true;
    }
    
    if (!authorized) {
      return res.status(403).json({ msg: 'Not authorized to access these records' });
    }
    
    // Get leaves
    const leaves = await Leave.find({ employee: employeeId })
      .sort({ startDate: -1 });
    
    res.json(leaves);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/leaves
// @desc    Create a new leave request
// @access  Private (owner/manager/employee)
router.post('/', [
  auth,
  [
    check('employeeId', 'Employee ID is required').not().isEmpty(),
    check('startDate', 'Start date is required').isISO8601(),
    check('endDate', 'End date is required').isISO8601(),
    check('type', 'Type must be valid').isIn(['sick', 'personal', 'vacation', 'unpaid', 'other'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { employeeId, startDate, endDate, type, reason } = req.body;
    
    // Find the employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    
    // Check authorization
    const user = await User.findById(req.user.id);
    let businessId;
    
    if (user.role === 'owner') {
      businessId = user._id;
      // Verify employee belongs to this business
      if (employee.business.toString() !== businessId.toString()) {
        return res.status(403).json({ msg: 'Not authorized to manage this employee' });
      }
    } else if (user.role === 'manager') {
      businessId = user.business;
      // Verify employee belongs to this business
      if (employee.business.toString() !== businessId.toString()) {
        return res.status(403).json({ msg: 'Not authorized to manage this employee' });
      }
    } else if (user.role === 'employee') {
      // Employee can only request leave for themselves
      if (employee.user.toString() !== user._id.toString()) {
        return res.status(403).json({ msg: 'Not authorized to request leave for another employee' });
      }
      businessId = employee.business;
    }
    
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate date range
    if (end < start) {
      return res.status(400).json({ msg: 'End date must be after start date' });
    }
    
    // Create leave
    const leaveData = {
      employee: employeeId,
      startDate: start,
      endDate: end,
      type,
      reason,
      business: businessId
    };
    
    // If owner/manager creates it, auto-approve
    if (user.role === 'owner' || user.role === 'manager') {
      leaveData.status = 'approved';
      leaveData.approvedBy = user._id;
    }
    
    const leave = new Leave(leaveData);
    await leave.save();
    
    // Create audit log
    await AuditLog.create({
      collectionName: 'Leave',
      operation: 'CREATE',
      documentId: leave._id,
      performedBy: req.user.id,
      newData: leave
    });
    
    res.json(leave);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/leaves/:id
// @desc    Update leave status
// @access  Private (owner/manager)
router.put('/:id', [
  auth,
  [
    check('status', 'Status is required').isIn(['pending', 'approved', 'rejected'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    // Check authorization
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    // Find leave
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ msg: 'Leave not found' });
    }
    
    const businessId = user.role === 'owner' ? user._id : user.business;
    
    // Verify record belongs to this business
    if (leave.business.toString() !== businessId.toString()) {
      return res.status(403).json({ msg: 'Not authorized to update this record' });
    }
    
    // Save previous state for audit
    const previousData = { ...leave.toObject() };
    
    // Update leave
    leave.status = status;
    
    if (status === 'approved' || status === 'rejected') {
      leave.approvedBy = user._id;
    }
    
    if (reason) leave.reason = reason;
    
    await leave.save();
    
    // Create audit log
    await AuditLog.create({
      collectionName: 'Leave',
      operation: 'UPDATE',
      documentId: leave._id,
      performedBy: req.user.id,
      previousData,
      newData: leave
    });
    
    res.json(leave);
    
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Leave not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/leaves/:id
// @desc    Delete leave
// @access  Private (owner/manager/self if pending)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find leave
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ msg: 'Leave not found' });
    }
    
    // Check authorization
    const user = await User.findById(req.user.id);
    let authorized = false;
    
    if (user.role === 'owner' && leave.business.toString() === user._id.toString()) {
      authorized = true;
    } else if (user.role === 'manager' && leave.business.toString() === user.business.toString()) {
      authorized = true;
    } else if (user.role === 'employee') {
      // Employee can only delete their own pending leave requests
      const employee = await Employee.findOne({ user: user._id });
      if (employee && leave.employee.toString() === employee._id.toString() && leave.status === 'pending') {
        authorized = true;
      }
    }
    
    if (!authorized) {
      return res.status(403).json({ msg: 'Not authorized to delete this record' });
    }
    
    // Save record for audit log
    const deletedRecord = { ...leave.toObject() };
    
    // Delete record
    await leave.remove();
    
    // Create audit log
    await AuditLog.create({
      collectionName: 'Leave',
      operation: 'DELETE',
      documentId: deletedRecord._id,
      performedBy: req.user.id,
      previousData: deletedRecord
    });
    
    res.json({ msg: 'Leave deleted' });
    
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Leave not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;