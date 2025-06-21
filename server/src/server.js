require('dotenv').config();
const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');
const socketSetup = require('./socket');
const logger = require('./utils/logger');

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
socketSetup(server);

// Get port from environment variables or use default
const PORT = process.env.PORT || 3000;

// Function to connect to database and start server
const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Start the server
startServer();
