const express = require('express');
const { query } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authenticate, isAdmin } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../middlewares/errorHandler');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, isAdmin, asyncHandler(userController.getAllUsers));

// Get user by ID
router.get('/:id', authenticate, asyncHandler(userController.getUserById));

// Search users by email
router.get(
  '/search',
  authenticate,
  [
    query('email').isEmail().withMessage('Please provide a valid email address'),
    validate,
  ],
  asyncHandler(userController.searchUsersByEmail)
);

// Delete user (admin or self)
router.delete('/:id', authenticate, asyncHandler(userController.deleteUser));

module.exports = router;
