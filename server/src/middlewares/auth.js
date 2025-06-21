const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to authenticate JWT token
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Middleware to check if user is admin
 */
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Requires admin privileges' });
  }
};

/**
 * Middleware to check if user is band member
 */
exports.isBandMember = async (req, res, next) => {
  try {
    const { bandId } = req.params;
    const userId = req.user.id;
    
    const membership = await req.user.getBandMemberships({
      where: { bandId }
    });
    
    if (membership && membership.length > 0) {
      // Add membership info to request
      req.bandRole = membership[0].role;
      next();
    } else {
      res.status(403).json({ message: 'Not a member of this band' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user is band admin
 */
exports.isBandAdmin = async (req, res, next) => {
  try {
    const { bandId } = req.params;
    const userId = req.user.id;
    
    const membership = await req.user.getBandMemberships({
      where: { bandId }
    });
    
    if (membership && membership.length > 0 && membership[0].role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Requires band admin privileges' });
    }
  } catch (error) {
    next(error);
  }
};
