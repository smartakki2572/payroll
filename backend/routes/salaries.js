// routes/salaries.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, ownerAuth } = require('../middleware/auth');
const SalaryRecord = require('../models/SalaryRecord');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Advance = require('../models/Advance');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @route   GET /api/salaries
// @desc    Get all salary records for a business (month/year)
// @access  Private (owner/manager)
router.get('/', auth, async (req, res) => {
  try {
    // Check authorization
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const businessId = user.role === 'owner' ? user._id : user.business;
    
    // Parse month and year from query
    const { month, year } = req.query;
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    // Build the query
    const query = { business: businessId };
    
    if (!isNaN(monthNum) && !isNaN(yearNum)) {
      query.month = monthNum;
      query.year = yearNum;
    } else if (!isNaN(yearNum)) {
      query.year = yearNum;
    }
    
    // Get salary records
    const salaries = await SalaryRecord.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName position'
      })
      .sort({ createdAt: -1 });
    
    res.json(salaries);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/salaries/employee/:employeeId
// @desc    Get salary history for an employee
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
    
    // Get salary records
    const salaries = await SalaryRecord.find({ employee: employeeId })
      .sort({ year: -1, month: -1 });
    
    res.json(salaries);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/salaries/calculate/:employeeId
// @desc    Calculate salary for an employee
// @access  Private (owner/manager)
router.post('/calculate/:employeeId', [
  auth,
  [
    check('month', 'Month is required (0-11)').isInt({ min: 0, max: 11 }),
    check('year', 'Year is required').isInt({ min: 2000, max: 2100 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { employeeId } = req.params;
    const { month, year } = req.body;
    
    // Check authorization
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const businessId = user.role === 'owner' ? user._id : user.business;
    
    // Find the employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    
    // Verify employee belongs to this business
    if (employee.business.toString() !== businessId.toString()) {
      return res.status(403).json({ msg: 'Not authorized to manage this employee' });
    }
    
    // Check if salary record already exists
    const existingSalary = await SalaryRecord.findOne({
      employee: employeeId,
      month,
      year
    });
    
    if (existingSalary) {
      return res.status(400).json({ 
        msg: 'Salary already calculated for this month',
        existingSalary
      });
    }
    
    // Calculate working days in the month
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    // Get start and end dates for the month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    // Get attendance records for the month
    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Calculate days worked, regular hours, overtime hours
    let daysWorked = 0;
    let regularHours = 0;
    let overtimeHours = 0;
    
    attendanceRecords.forEach(record => {
      if (record.status === 'present' || record.status === 'half-day') {
        daysWorked += record.status === 'half-day' ? 0.5 : 1;
        regularHours += record.hoursWorked || 0;
        overtimeHours += record.overtimeHours || 0;
      }
    });
    
    // Get advances and loans for the month
    const advances = await Advance.find({
      employee: employeeId,
      date: {
        $gte: startDate,
        $lte: endDate
      },
      status: { $in: ['approved', 'paid', 'partially_paid'] }
    });
    
    // Calculate deductions
    let advanceDeductions = 0;
    let loanDeductions = 0;
    
    advances.forEach(advance => {
      if (advance.type === 'advance') {
        advanceDeductions += advance.amount;
      } else if (advance.type === 'loan') {
        loanDeductions += advance.installments.amountPerInstallment;
        
        // Update loan status
        advance.installments.paid += 1;
        if (advance.installments.paid >= advance.installments.total) {
          advance.status = 'paid';
        } else {
          advance.status = 'partially_paid';
        }
        advance.save();
      }
    });
    
    // Calculate gross salary
    const regularPay = employee.hourlyRate * regularHours;
    const overtimePay = employee.overtimeRate * overtimeHours;
    const grossSalary = regularPay + overtimePay;
    
    // Calculate net salary
    const totalDeductions = advanceDeductions + loanDeductions;
    const netSalary = grossSalary - totalDeductions;
    
    // Create salary record
    const salaryRecord = new SalaryRecord({
      employee: employeeId,
      month,
      year,
      totalWorkingDays: totalDays,
      daysWorked,
      regularHours,
      overtimeHours,
      grossSalary,
      deductions: {
        advances: advanceDeductions,
        loans: loanDeductions
      },
      netSalary,
      business: businessId,
      createdBy: req.user.id
    });
    
    await salaryRecord.save();
    
    // Create audit log
    await AuditLog.create({
      collectionName: 'SalaryRecord',
      operation: 'CREATE',
      documentId: salaryRecord._id,
      performedBy: req.user.id,
      newData: salaryRecord
    });
    
    res.json(salaryRecord);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/salaries/:id
// @desc    Update salary record (mark as paid)
// @access  Private (owner/manager)
router.put('/:id', [
  auth,
  [
    check('isPaid', 'Payment status is required').isBoolean(),
    check('paymentMethod', 'Payment method is required when marking as paid').optional().isIn(['cash', 'bank_transfer', 'check', 'other'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { id } = req.params;
    const { isPaid, paymentMethod, notes } = req.body;
    
    // Check authorization
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const businessId = user.role === 'owner' ? user._id : user.business;
    
    // Find salary record
    const salaryRecord = await SalaryRecord.findById(id);
    if (!salaryRecord) {
      return res.status(404).json({ msg: 'Salary record not found' });
    }
    
    // Verify record belongs to this business
    if (salaryRecord.business.toString() !== businessId.toString()) {
      return res.status(403).json({ msg: 'Not authorized to update this record' });
    }
    
    // Save previous state for audit
    const previousData = { ...salaryRecord.toObject() };
    
    // Update record
    salaryRecord.isPaid = isPaid;
    
    if (isPaid && !salaryRecord.isPaid) {
      salaryRecord.paymentDate = Date.now();
      salaryRecord.paymentMethod = paymentMethod || 'cash';
    } else if (!isPaid) {
      salaryRecord.paymentDate = null;
      salaryRecord.paymentMethod = null;
    }
    
    if (notes) salaryRecord.notes = notes;
    
    await salaryRecord.save();
    
    // Create audit log
    await AuditLog.create({
      collectionName: 'SalaryRecord',
      operation: 'UPDATE',
      documentId: salaryRecord._id,
      performedBy: req.user.id,
      previousData,
      newData: salaryRecord
    });
    
    res.json(salaryRecord);
    
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Salary record not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/salaries/:id
// @desc    Delete salary record
// @access  Private (owner only)
router.delete('/:id', auth, ownerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find salary record
    const salaryRecord = await SalaryRecord.findById(id);
    if (!salaryRecord) {
      return res.status(404).json({ msg: 'Salary record not found' });
    }
    
    // Verify record belongs to this business
    if (salaryRecord.business.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this record' });
    }
    
    // Save record for audit log
    const deletedRecord = { ...salaryRecord.toObject() };
    
    // Delete record
    await salaryRecord.remove();
    
    // Create audit log
    await AuditLog.create({
      collectionName: 'SalaryRecord',
      operation: 'DELETE',
      documentId: deletedRecord._id,
      performedBy: req.user.id,
      previousData: deletedRecord
    });
    
    res.json({ msg: 'Salary record deleted' });
    
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Salary record not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;