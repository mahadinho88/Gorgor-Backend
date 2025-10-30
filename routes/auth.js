const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route   POST /api/v1/auth/register
// @desc    Register a new user (supports both session and JWT)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password, region, district } = req.body;

    // Validation
    if (!fullName || !phoneNumber || !password || !region || !district) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      phoneNumber,
      email,
      password,
      region,
      district
    });

    // Set session for web users
    if (req.session) {
      req.session.userId = user._id;
    }

    // Generate JWT token for mobile app users
    const token = generateToken(user._id);

    const userData = {
      id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      region: user.region,
      district: user.district,
      role: user.role,
      isActive: user.isActive
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token, // JWT token for mobile apps
      user: userData
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user'
    });
  }
});

// @route   POST /api/v1/auth/login
// @desc    Login user (supports both session and JWT)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password, useJwt } = req.body; // useJwt flag for mobile apps

    // Validation
    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and password'
      });
    }

    // Check for user (include password field)
    const user = await User.findOne({ phoneNumber }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const userData = {
      id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      region: user.region,
      district: user.district,
      role: user.role,
      isActive: user.isActive
    };

    // For mobile apps (use JWT)
    if (useJwt) {
      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: userData
      });
    }

    // For web users (use session)
    if (req.session) {
      req.session.userId = user._id;
      // Explicitly save the session
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({
            success: false,
            message: 'Login failed'
          });
        }
        
        res.json({
          success: true,
          message: 'Login successful',
          user: userData
        });
      });
    } else {
      res.json({
        success: true,
        message: 'Login successful',
        user: userData
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in'
    });
  }
});

// @route   POST /api/v1/auth/logout
// @desc    Logout user (supports both session and JWT)
// @access  Private
router.post('/logout', (req, res) => {
  // For web users (destroy session)
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({
          success: false,
          message: 'Logout failed'
        });
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      });
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } else {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
});

// @route   GET /api/v1/auth/status
// @desc    Check authentication status
// @access  Public
router.get('/status', (req, res) => {
  // For web users (check session)
  if (req.session && req.session.userId) {
    return res.json({
      success: true,
      authenticated: true,
      userId: req.session.userId
    });
  }
  
  // For mobile users (check JWT in header)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.json({
        success: true,
        authenticated: true,
        userId: decoded.id
      });
    } catch (error) {
      // Token invalid
    }
  }

  res.json({
    success: true,
    authenticated: false
  });
});

module.exports = router;