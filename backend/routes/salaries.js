// routes/salaries.js
const express = require('express');
const router = express.Router();
const SalaryRecord = require('../models/SalaryRecord');

// Create a salary record
router.post('/', async (req, res) => {
  try {
    const salaryRecord = new SalaryRecord(req.body);
    const savedRecord = await salaryRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all salary records
router.get('/', async (req, res) => {
  try {
    const records = await SalaryRecord.find().populate('employee');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a salary record
router.put('/:id', async (req, res) => {
  try {
    const updatedRecord = await SalaryRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a salary record
router.delete('/:id', async (req, res) => {
  try {
    await SalaryRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Salary record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;