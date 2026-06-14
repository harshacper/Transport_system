const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Protect middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error('Authorize failed: req.user is null or undefined');
      return res.status(403).json({ message: 'Not authorized for this role (User not found)' });
    }
    if (!roles.includes(req.user.role)) {
      console.error(`Authorize failed: User role ${req.user.role} not in ${roles}`);
      return res.status(403).json({ message: `Not authorized for this role: expected ${roles}, got ${req.user.role}` });
    }
    next();
  };
};

module.exports = { protect, authorize };
