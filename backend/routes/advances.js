// routes/advances.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, ownerAuth } = require('../middleware/auth');
const Advance = require('../models/Advance');
const Employee = require('../models/Employee');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @route   GET /api/advances
// @desc    Get all advances/loans for a business
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
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Get advances/loans
    const advances = await Advance.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName position'
      })
      .sort({ date: -1 });
    
    res.json(advances);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/advances/employee/:employeeId
// @desc    Get advances/loans for an employee
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
    
    // Get advances/loans
    const advances = await Advance.find({ employee: employeeId })
      .sort({ date: -1 });
    
    res.json(advances);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/advances
// @desc    Create a new advance/loan
// @access  Private (owner/manager)
router.post('/', [
  auth,
  [
    check('employeeId', 'Employee ID is required').not().isEmpty(),
    check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 }),
    check('type', 'Type must be advance or loan').isIn(['advance', 'loan']),
    check('installments', 'Installments must be a positive integer for loans').optional().isInt({ min: 1 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Check authorization
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const businessId = user.role === 'owner' ? user._id : user.business;
    
    const { employeeId, amount, type, description, installments } = req.body;
    
    // Find the employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    
    // Verify employee belongs to this business
    if (employee.business.toString() !== businessId.toString()) {
      return res.status(403).json({ msg: 'Not authorized to manage this employee' });
    }
    
    // Create advance/loan
    const advanceData = {
      employee: employeeId,
      amount,
      type,
      description,
      business: businessId,
      status: user.role === 'owner' ? 'approved' : 'pending'
    };
    
    // If it's a loan, add installment details
    if (type === 'loan' && installments) {
      advanceData.installments = {
        total: installments,
        paid: 0,
        amountPerInstallment: (amount / installments).toFixed(2)
      };
    }
    
    // If owner creates it, auto-approve
    if (user.role === 'owner') {
      advanceData.approvedBy = user._id;
    }
    
    const advance = new Advance(advanceData);
    await advance.save();
    
    // Create audit log
    await AuditLog.create({
      collectionName: 'Advance',
      operation: 'CREATE',
      documentId: advance._id,
      performedBy: req.user.id,
      newData: advance
    });
    
    res.json(advance);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/advances/:id
// @desc    Update advance/loan status
// @access  Private (owner only)
router.put('/:id', [
  auth,
  ownerAuth,
  [
    check('status', 'Status is required').isIn(['pending', 'approved', 'paid', 'partially_paid'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Find advance/loan
    const advance = await Advance.findById(id);
    if (!advance) {
      return res.status(404).json({ msg: 'Advance/loan not found' });
    }
    
    // Verify record belongs to this business
    if (advance.business.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update this record' });
    }
    
    // Save previous state for audit
    const previousData = { ...advance.toObject() };
    
    // Update status
    advance.status = status;
    
    // If approving, set approvedBy
    if (status === 'approved' && advance.status !== 'approved') {
      advance.approvedBy = req.user.id;
    }
    
    await advance.save();
    
    // Create audit log
    await AuditLog.create({
      collectionName: 'Advance',
      operation: 'UPDATE',
      documentId: advance._id,
      performedBy: req.user.id,
      previousData,
      newData: advance
    });
    
    res.json(advance);
    
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Advance/loan not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/advances/:id
// @desc    Delete advance/loan
// @access  Private (owner only)
router.delete('/:id', auth, ownerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find advance/loan
    const advance = await Advance.findById(id);
    if (!advance) {
      return res.status(404).json({ msg: 'Advance/loan not found' });
    }
    
    // Verify record belongs to this business
    if (advance.business.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this record' });
    }
    
    // Save record for audit log
    const deletedRecord = { ...advance.toObject() };
    
    // Delete record
    await advance.remove();
    
    // Create audit log
    await AuditLog.create({
      collectionName: 'Advance',
      operation: 'DELETE',
      documentId: deletedRecord._id,
      performedBy: req.user.id,
      previousData: deletedRecord
    });
    
    res.json({ msg: 'Advance/loan deleted' });
    
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Advance/loan not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;