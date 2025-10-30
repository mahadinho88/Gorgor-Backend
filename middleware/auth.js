const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hybrid authentication middleware (supports both JWT and sessions)
exports.protect = async (req, res, next) => {
  try {
    // Check for JWT token in headers first (for mobile apps)
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from token
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
          return next();
        }
      } catch (error) {
        // JWT invalid, continue to check session
      }
    }

    // Check for session (for web users)
    if (req.session && req.session.userId) {
      // Get user from session
      const user = await User.findById(req.session.userId);
      if (user) {
        req.user = user;
        return next();
      }
      
      // If user not found, destroy invalid session
      req.session.destroy(() => {});
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Admin middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Middleware to attach user to request (for optional authentication)
exports.attachUser = async (req, res, next) => {
  try {
    // Check for JWT token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      } catch (error) {
        // JWT invalid, continue to check session
      }
    }

    // Check for session
    if (req.session && req.session.userId) {
      try {
        const user = await User.findById(req.session.userId).select('-password');
        if (user) {
          req.user = user;
        }
      } catch (error) {
        console.error('Error attaching user:', error);
      }
    }
  } catch (error) {
    console.error('Error in attachUser middleware:', error);
  }
  next();
};