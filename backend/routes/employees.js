// routes/employees.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, ownerAuth } = require('../middleware/auth');
const Employee = require('../models/Employee');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @route   GET /api/employees
// @desc    Get all employees for a business
// @access  Private (owner/manager)
router.get('/', auth, async (req, res) => {
  try {
    // Check if the user is authorized
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Get business ID (for owner it's their own ID)
    const businessId = user.role === 'owner' ? user._id : user.business;

    // Get all employees
    const employees = await Employee.find({ business: businessId, isActive: true })
      .populate('user', ['username', 'email'])
      .sort({ lastName: 1 });

    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private (owner/manager)
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('user', ['username', 'email']);

    // Check if employee exists
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    // Check if user has access to this employee
    const user = await User.findById(req.user.id);
    if (user.role === 'owner') {
      if (employee.business.toString() !== user._id.toString()) {
        return res.status(403).json({ msg: 'Not authorized to access this employee' });
      }
    } else if (user.role === 'manager') {
      if (employee.business.toString() !== user.business.toString()) {
        return res.status(403).json({ msg: 'Not authorized to access this employee' });
      }
    } else {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(employee);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Private (owner/manager)
router.post('/', [
  auth,
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty(),
    check('hourlyRate', 'Hourly rate must be a positive number').isFloat({ min: 0 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is authorized
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const businessId = user.role === 'owner' ? user._id : user.business;

    // Create employee
    const { 
      firstName, lastName, position, hourlyRate, overtimeRate,
      contactNumber, emergencyContact, address, notes,
      userId // Optional: Link to existing user
    } = req.body;

    let userRef = null;

    // If userId is provided, link to existing user
    if (userId) {
      userRef = await User.findById(userId);
      if (!userRef) {
        return res.status(404).json({ msg: 'User not found' });
      }
    } else {
      // Create a new user for this employee
      const email = req.body.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
      const username = `${firstName} ${lastName}`;
      
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
      
      userRef = new User({
        username,
        email,
        role: 'employee',
        // Generate random password - in production, send email with temp password
        password: Math.random().toString(36).slice(-8)
      });
      
      await userRef.save();
    }

    const employee = new Employee({
      user: userRef._id,
      firstName,
      lastName,
      position,
      hourlyRate,
      overtimeRate: overtimeRate || hourlyRate * 1.5,
      contactNumber,
      emergencyContact,
      address,
      notes,
      business: businessId
    });

    await employee.save();

    // Log the creation
    await AuditLog.create({
      collectionName: 'Employee',
      operation: 'CREATE',
      documentId: employee._id,
      performedBy: req.user.id,
      newData: employee
    });

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/employees/:id
// @desc    Update an employee
// @access  Private (owner/manager)
router.put('/:id', [
  auth,
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty(),
    check('hourlyRate', 'Hourly rate must be a positive number').isFloat({ min: 0 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find employee
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    // Check authorization
    const user = await User.findById(req.user.id);
    if (user.role === 'owner') {
      if (employee.business.toString() !== user._id.toString()) {
        return res.status(403).json({ msg: 'Not authorized to update this employee' });
      }
    } else if (user.role === 'manager') {
      if (employee.business.toString() !== user.business.toString()) {
        return res.status(403).json({ msg: 'Not authorized to update this employee' });
      }
    } else {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Save previous data for audit
    const previousData = { ...employee.toObject() };

    // Update fields
    const {
      firstName, lastName, position, hourlyRate, overtimeRate,
      contactNumber, emergencyContact, address, notes, isActive
    } = req.body;

    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.position = position;
    employee.hourlyRate = hourlyRate;
    employee.overtimeRate = overtimeRate || hourlyRate * 1.5;
    
    if (contactNumber) employee.contactNumber = contactNumber;
    if (emergencyContact) employee.emergencyContact = emergencyContact;
    if (address) employee.address = address;
    if (notes) employee.notes = notes;
    if (isActive !== undefined) employee.isActive = isActive;
    
    // If employee is marked inactive, set end date
    if (isActive === false && !employee.endDate) {
      employee.endDate = Date.now();
    } else if (isActive === true && employee.endDate) {
      employee.endDate = null;
    }

    await employee.save();

    // Create audit log
    await AuditLog.create({
      collectionName: 'Employee',
      operation: 'UPDATE',
      documentId: employee._id,
      performedBy: req.user.id,
      previousData,
      newData: employee
    });

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete an employee (soft delete by marking inactive)
// @access  Private (owner only)
router.delete('/:id', auth, ownerAuth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    // Only allow owners to delete their own employees
    if (employee.business.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this employee' });
    }

    // Save previous state for audit
    const previousData = { ...employee.toObject() };

    // Perform soft delete
    employee.isActive = false;
    employee.endDate = Date.now();
    await employee.save();

    // Log the deletion
    await AuditLog.create({
      collectionName: 'Employee',
      operation: 'DELETE',
      documentId: employee._id,
      performedBy: req.user.id,
      previousData,
      newData: employee
    });
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/employees/search/:term
// @desc    Search employees by name
// @access  Private (owner/manager)
router.get('/search/:term', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'owner' && user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const businessId = user.role === 'owner' ? user._id : user.business;
    const term = req.params.term;
    
    // Create a regex for case-insensitive search
    const searchRegex = new RegExp(term, 'i');
    
    // Search in first name and last name
    const employees = await Employee.find({
      business: businessId,
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex }
      ]
    }).populate('user', ['username', 'email']);
    
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;