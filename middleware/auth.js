const User = require('../models/User');

// Session-based authentication middleware
exports.protect = async (req, res, next) => {
  try {
    // Check if user is authenticated via session
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
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      req.user = user;
    } catch (error) {
      console.error('Error attaching user:', error);
    }
  }
  next();
};