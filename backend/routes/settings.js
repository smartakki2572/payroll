// routes/settings.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, ownerAuth } = require('../middleware/auth');
const BusinessSettings = require('../models/BusinessSettings');
const AuditLog = require('../models/AuditLog');

// @route   GET /api/settings
// @desc    Get business settings
// @access  Private (owner only)
router.get('/', auth, ownerAuth, async (req, res) => {
  try {
    // Get settings for the owner
    let settings = await BusinessSettings.findOne({ owner: req.user.id });
    
    // If settings don't exist, create default settings
    if (!settings) {
      settings = await BusinessSettings.create({
        owner: req.user.id,
        businessName: 'My Business'
      });
    }
    
    res.json(settings);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/settings
// @desc    Update business settings
// @access  Private (owner only)
router.put('/', [
  auth,
  ownerAuth,
  [
    check('businessName', 'Business name is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Extract settings from request
    const {
      businessName,
      workingHours,
      paymentSettings,
      notificationSettings
    } = req.body;
    
    // Find existing settings
    let settings = await BusinessSettings.findOne({ owner: req.user.id });
    
    if (!settings) {
      // Create new settings if they don't exist
      settings = new BusinessSettings({
        owner: req.user.id,
        businessName
      });
    } else {
      // Save previous state for audit
      const previousData = { ...settings.toObject() };
      
      // Update fields
      settings.businessName = businessName;
      
      if (workingHours) {
        settings.workingHours = {
          ...settings.workingHours,
          ...workingHours
        };
      }
      
      if (paymentSettings) {
        settings.paymentSettings = {
          ...settings.paymentSettings,
          ...paymentSettings
        };
      }
      
      if (notificationSettings) {
        settings.notificationSettings = {
          ...settings.notificationSettings,
          ...notificationSettings
        };
      }
      
      // Create audit log
      await AuditLog.create({
        collectionName: 'BusinessSettings',
        operation: settings.isNew ? 'CREATE' : 'UPDATE',
        documentId: settings._id,
        performedBy: req.user.id,
        previousData: settings.isNew ? {} : previousData,
        newData: settings
      });
    }
    
    await settings.save();
    res.json(settings);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;