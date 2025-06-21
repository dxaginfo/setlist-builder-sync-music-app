const express = require('express');
const { body, param, query } = require('express-validator');
const setlistController = require('../controllers/setlist.controller');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../middlewares/errorHandler');

const router = express.Router();

// Get all setlists (that the user has access to)
router.get('/', authenticate, asyncHandler(setlistController.getSetlists));

// Create a new setlist
router.post(
  '/',
  authenticate,
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters'),
    body('description').optional().trim(),
    body('bandId').optional().isUUID().withMessage('Invalid band ID'),
    body('isPublic').optional().isBoolean(),
    body('eventDate').optional().isISO8601().withMessage('Invalid date format'),
    body('venue').optional().trim(),
    validate,
  ],
  asyncHandler(setlistController.createSetlist)
);

// Get a setlist by ID
router.get(
  '/:id',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    validate,
  ],
  asyncHandler(setlistController.getSetlistById)
);

// Update a setlist
router.put(
  '/:id',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters'),
    body('description').optional().trim(),
    body('isPublic').optional().isBoolean(),
    body('eventDate').optional().isISO8601().withMessage('Invalid date format'),
    body('venue').optional().trim(),
    validate,
  ],
  asyncHandler(setlistController.updateSetlist)
);

// Delete a setlist
router.delete(
  '/:id',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    validate,
  ],
  asyncHandler(setlistController.deleteSetlist)
);

// Get all items in a setlist
router.get(
  '/:id/items',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    validate,
  ],
  asyncHandler(setlistController.getSetlistItems)
);

// Add an item to a setlist
router.post(
  '/:id/items',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    body('songId').isUUID().withMessage('Invalid song ID'),
    body('position').optional().isInt({ min: 0 }).withMessage('Position must be a non-negative integer'),
    body('customKey').optional().trim(),
    body('customTempo').optional().isInt({ min: 0, max: 300 }).withMessage('Tempo must be between 0 and 300'),
    body('customDuration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive number'),
    body('notes').optional().trim(),
    body('setNumber').optional().isInt({ min: 1 }).withMessage('Set number must be a positive integer'),
    validate,
  ],
  asyncHandler(setlistController.addSetlistItem)
);

// Update a setlist item
router.put(
  '/:id/items/:itemId',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    param('itemId').isUUID().withMessage('Invalid item ID'),
    body('customKey').optional().trim(),
    body('customTempo').optional().isInt({ min: 0, max: 300 }).withMessage('Tempo must be between 0 and 300'),
    body('customDuration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive number'),
    body('notes').optional().trim(),
    body('setNumber').optional().isInt({ min: 1 }).withMessage('Set number must be a positive integer'),
    validate,
  ],
  asyncHandler(setlistController.updateSetlistItem)
);

// Remove an item from a setlist
router.delete(
  '/:id/items/:itemId',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    param('itemId').isUUID().withMessage('Invalid item ID'),
    validate,
  ],
  asyncHandler(setlistController.removeSetlistItem)
);

// Reorder setlist items
router.put(
  '/:id/reorder',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    body('itemIds').isArray().withMessage('Item IDs must be an array'),
    validate,
  ],
  asyncHandler(setlistController.reorderSetlistItems)
);

// Get all versions of a setlist
router.get(
  '/:id/versions',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    validate,
  ],
  asyncHandler(setlistController.getSetlistVersions)
);

// Create a new version of a setlist
router.post(
  '/:id/versions',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    body('notes').optional().trim(),
    validate,
  ],
  asyncHandler(setlistController.createSetlistVersion)
);

// Get a specific version of a setlist
router.get(
  '/:id/versions/:versionId',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    param('versionId').isUUID().withMessage('Invalid version ID'),
    validate,
  ],
  asyncHandler(setlistController.getSetlistVersion)
);

// Restore a setlist to a previous version
router.post(
  '/:id/versions/:versionId/restore',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    param('versionId').isUUID().withMessage('Invalid version ID'),
    validate,
  ],
  asyncHandler(setlistController.restoreSetlistVersion)
);

// Share a setlist
router.post(
  '/:id/share',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    body('emails').isArray().withMessage('Emails must be an array'),
    body('emails.*').isEmail().withMessage('All entries must be valid email addresses'),
    body('message').optional().trim(),
    validate,
  ],
  asyncHandler(setlistController.shareSetlist)
);

// Export a setlist
router.get(
  '/:id/export',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    query('format').optional().isIn(['pdf', 'csv', 'txt']).withMessage('Invalid format'),
    validate,
  ],
  asyncHandler(setlistController.exportSetlist)
);

// Get all comments for a setlist
router.get(
  '/:id/comments',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    validate,
  ],
  asyncHandler(setlistController.getSetlistComments)
);

// Add a comment to a setlist
router.post(
  '/:id/comments',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    body('content').notEmpty().withMessage('Comment content is required'),
    body('parentCommentId').optional().isUUID().withMessage('Invalid parent comment ID'),
    validate,
  ],
  asyncHandler(setlistController.addSetlistComment)
);

// Delete a comment
router.delete(
  '/:id/comments/:commentId',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    param('commentId').isUUID().withMessage('Invalid comment ID'),
    validate,
  ],
  asyncHandler(setlistController.deleteSetlistComment)
);

module.exports = router;
