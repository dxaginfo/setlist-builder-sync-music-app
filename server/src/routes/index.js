const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const bandRoutes = require('./band.routes');
const songRoutes = require('./song.routes');
const setlistRoutes = require('./setlist.routes');

const router = express.Router();

// Default API route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Setlist Builder + Sync API',
    version: '0.1.0',
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bands', bandRoutes);
router.use('/songs', songRoutes);
router.use('/setlists', setlistRoutes);

module.exports = router;
