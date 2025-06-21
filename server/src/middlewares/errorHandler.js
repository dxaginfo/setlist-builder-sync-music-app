const logger = require('../utils/logger');

/**
 * Global error handler middleware
 */
exports.errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack, path: req.path });
  
  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  } else if (err.name === 'SequelizeDatabaseError') {
    statusCode = 500;
    message = 'Database error';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Avoid leaking error details in production
  const error = process.env.NODE_ENV === 'production' ? 
    { message } : 
    { message, stack: err.stack, name: err.name };
  
  res.status(statusCode).json({ error });
};

/**
 * Not found error handler middleware
 */
exports.notFoundHandler = (req, res) => {
  res.status(404).json({ error: { message: 'Resource not found' } });
};

/**
 * Async handler to catch errors in async route handlers
 */
exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
