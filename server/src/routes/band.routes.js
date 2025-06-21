const express = require('express');
const { body, param } = require('express-validator');
const bandController = require('../controllers/band.controller');
const { authenticate, isBandMember, isBandAdmin } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../middlewares/errorHandler');

const router = express.Router();

// Get all bands (that the user is a member of)
router.get('/', authenticate, asyncHandler(bandController.getBands));

// Create a new band
router.post(
  '/',
  authenticate,
  [
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Band name must be between 1 and 100 characters'),
    body('description').optional().trim(),
    validate,
  ],
  asyncHandler(bandController.createBand)
);

// Get a band by ID
router.get(
  '/:bandId',
  authenticate,
  isBandMember,
  asyncHandler(bandController.getBandById)
);

// Update a band
router.put(
  '/:bandId',
  authenticate,
  isBandAdmin,
  [
    param('bandId').isUUID().withMessage('Invalid band ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Band name must be between 1 and 100 characters'),
    body('description').optional().trim(),
    validate,
  ],
  asyncHandler(bandController.updateBand)
);

// Delete a band
router.delete(
  '/:bandId',
  authenticate,
  isBandAdmin,
  asyncHandler(bandController.deleteBand)
);

// Get band members
router.get(
  '/:bandId/members',
  authenticate,
  isBandMember,
  asyncHandler(bandController.getBandMembers)
);

// Add a member to a band
router.post(
  '/:bandId/members',
  authenticate,
  isBandAdmin,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('role')
      .isIn(['admin', 'member', 'viewer'])
      .withMessage('Role must be admin, member, or viewer'),
    validate,
  ],
  asyncHandler(bandController.addBandMember)
);

// Update a band member
router.put(
  '/:bandId/members/:userId',
  authenticate,
  isBandAdmin,
  [
    body('role')
      .isIn(['admin', 'member', 'viewer'])
      .withMessage('Role must be admin, member, or viewer'),
    validate,
  ],
  asyncHandler(bandController.updateBandMember)
);

// Remove a member from a band
router.delete(
  '/:bandId/members/:userId',
  authenticate,
  isBandAdmin,
  asyncHandler(bandController.removeBandMember)
);

// Get band songs
router.get(
  '/:bandId/songs',
  authenticate,
  isBandMember,
  asyncHandler(bandController.getBandSongs)
);

// Get band setlists
router.get(
  '/:bandId/setlists',
  authenticate,
  isBandMember,
  asyncHandler(bandController.getBandSetlists)
);

module.exports = router;
