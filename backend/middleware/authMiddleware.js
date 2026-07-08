const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: 'User account is suspended or invalid' });
      }
      
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Authorization verification failed, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, session token is missing' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Permission denied. Access restricted to roles: [${roles.join(', ')}]` 
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };