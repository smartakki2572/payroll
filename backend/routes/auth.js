// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const BusinessSettings = require('../models/BusinessSettings');
const { auth, ownerAuth } = require('../middleware/auth');

// @route   GET /api/auth/google
// @desc    Auth with Google
// @access  Public
router.get('/google', (req, res, next) => {
  console.log('Google OAuth route accessed');
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public


router.get('/test-auth', (req, res) => {
  console.log('Auth test route hit');
  res.send('Auth routes are working properly');
});
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role is required').isIn(['owner', 'manager', 'employee'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      role
    });

    await user.save();

    // If owner, create default business settings
    if (role === 'owner') {
      await BusinessSettings.create({
        owner: user._id,
        businessName: `${username}'s Business`
      });
    }

    // Log in the user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ errors: [{ msg: 'Login error after registration' }] });
      }
      return res.json({ user: { id: user._id, username, email, role } });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Log in user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ errors: [{ msg: 'Login error' }] });
      }
      return res.json({ 
        user: { 
          id: user._id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        } 
      });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { 
      return res.status(500).json({ msg: 'Error during logout' });
    }
    res.json({ msg: 'Successfully logged out' });
  });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;