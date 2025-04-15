// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
exports.auth = (req, res, next) => {
  // Check for session authentication (using passport)
  if (req.isAuthenticated()) {
    return next();
  }
  
  // If no user in session, check for JWT token
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check if user is an owner
exports.ownerAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'owner') {
      return res.status(403).json({ msg: 'Not authorized, owner access required' });
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Middleware to check if user is a manager or owner
exports.managerAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || (user.role !== 'manager' && user.role !== 'owner')) {
      return res.status(403).json({ msg: 'Not authorized, manager access required' });
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};