const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('./models');
const logger = require('./utils/logger');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket.IO middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    const username = socket.user.username;
    
    logger.info(`User connected: ${username} (${userId})`);
    
    // Join user's own room for private messages
    socket.join(`user:${userId}`);
    
    // Handle joining a setlist room
    socket.on('join-setlist', (setlistId) => {
      logger.info(`${username} joined setlist: ${setlistId}`);
      socket.join(`setlist:${setlistId}`);
      
      // Notify others in the room that a user has joined
      socket.to(`setlist:${setlistId}`).emit('user-joined', {
        userId,
        username,
        timestamp: new Date(),
      });
    });
    
    // Handle leaving a setlist room
    socket.on('leave-setlist', (setlistId) => {
      logger.info(`${username} left setlist: ${setlistId}`);
      socket.leave(`setlist:${setlistId}`);
      
      // Notify others in the room that a user has left
      socket.to(`setlist:${setlistId}`).emit('user-left', {
        userId,
        username,
        timestamp: new Date(),
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${username} (${userId})`);
    });
  });

  // Function to emit setlist updates
  const emitSetlistUpdate = (setlistId, data) => {
    io.to(`setlist:${setlistId}`).emit('setlist-updated', data);
  };

  // Function to emit setlist item updates
  const emitSetlistItemUpdate = (setlistId, data) => {
    io.to(`setlist:${setlistId}`).emit('setlist-item-updated', data);
  };

  // Function to emit when setlist items are reordered
  const emitSetlistReordered = (setlistId, data) => {
    io.to(`setlist:${setlistId}`).emit('setlist-reordered', data);
  };

  // Function to emit when a new comment is added
  const emitNewComment = (setlistId, data) => {
    io.to(`setlist:${setlistId}`).emit('new-comment', data);
  };

  // Function to emit notifications to a specific user
  const emitUserNotification = (userId, data) => {
    io.to(`user:${userId}`).emit('notification', data);
  };

  // Return socket functions to be used elsewhere in the application
  return {
    io,
    emitSetlistUpdate,
    emitSetlistItemUpdate,
    emitSetlistReordered,
    emitNewComment,
    emitUserNotification,
  };
};
