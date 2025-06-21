const express = require('express');
const { body, param, query } = require('express-validator');
const songController = require('../controllers/song.controller');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../middlewares/errorHandler');
const { upload } = require('../middlewares/upload');

const router = express.Router();

// Get all songs (that the user has access to)
router.get('/', authenticate, asyncHandler(songController.getSongs));

// Search songs
router.get(
  '/search',
  authenticate,
  [
    query('q').optional().isString(),
    validate,
  ],
  asyncHandler(songController.searchSongs)
);

// Import song from Spotify
router.post(
  '/import/spotify',
  authenticate,
  [
    body('spotifyId').notEmpty().withMessage('Spotify track ID is required'),
    body('bandId').optional().isUUID().withMessage('Invalid band ID'),
    validate,
  ],
  asyncHandler(songController.importSongFromSpotify)
);

// Create a new song
router.post(
  '/',
  authenticate,
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters'),
    body('artist').optional().trim(),
    body('key').optional().trim(),
    body('tempo').optional().isInt({ min: 0, max: 300 }).withMessage('Tempo must be between 0 and 300'),
    body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive number'),
    body('genre').optional().trim(),
    body('notes').optional().trim(),
    body('lyrics').optional().trim(),
    body('chordChart').optional().trim(),
    body('bandId').optional().isUUID().withMessage('Invalid band ID'),
    body('isPublic').optional().isBoolean(),
    validate,
  ],
  asyncHandler(songController.createSong)
);

// Get a song by ID
router.get(
  '/:id',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    validate,
  ],
  asyncHandler(songController.getSongById)
);

// Update a song
router.put(
  '/:id',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters'),
    body('artist').optional().trim(),
    body('key').optional().trim(),
    body('tempo').optional().isInt({ min: 0, max: 300 }).withMessage('Tempo must be between 0 and 300'),
    body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive number'),
    body('genre').optional().trim(),
    body('notes').optional().trim(),
    body('lyrics').optional().trim(),
    body('chordChart').optional().trim(),
    body('isPublic').optional().isBoolean(),
    validate,
  ],
  asyncHandler(songController.updateSong)
);

// Delete a song
router.delete(
  '/:id',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    validate,
  ],
  asyncHandler(songController.deleteSong)
);

// Upload an attachment to a song
router.post(
  '/:id/attachments',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    validate,
  ],
  upload.single('file'),
  asyncHandler(songController.uploadAttachment)
);

// Get all attachments for a song
router.get(
  '/:id/attachments',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    validate,
  ],
  asyncHandler(songController.getAttachments)
);

// Delete an attachment
router.delete(
  '/:id/attachments/:attachmentId',
  authenticate,
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    param('attachmentId').isUUID().withMessage('Invalid attachment ID'),
    validate,
  ],
  asyncHandler(songController.deleteAttachment)
);

module.exports = router;
