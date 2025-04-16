// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express
const app = express();

// Basic middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: false, // Important: set to false for development
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
require('./config/passport')(passport);

// Simple logging middleware to debug route access
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Simple test route
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.send('Server is working!');
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/salaries', require('./routes/salaries'));
// app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/advances', require('./routes/advances'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/reports', require('./routes/reports'));

// Simple error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;