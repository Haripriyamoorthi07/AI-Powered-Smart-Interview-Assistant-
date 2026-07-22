const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345');

      // Check if we are running in Mongoose DB mode
      if (User.db.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      
      // Fallback if user is not in DB or we are in mock db mode
      if (!req.user) {
        req.user = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role || 'user',
          profile: decoded.profile || {
            bio: '',
            avatar: '',
            targetRole: 'Software Engineer',
            targetDifficulty: 'Intermediate'
          }
        };
      }

      next();
    } catch (error) {
      console.error('Authentication verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, admin access only' });
  }
};

module.exports = { protect, adminOnly };
