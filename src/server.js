require('dotenv').config();
const createApp = require('./config/app');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = createApp();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Server is running!
📋 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Port: ${PORT}
📖 API Documentation: http://localhost:${PORT}/api-docs
❤️  Health Check: http://localhost:${PORT}/health
🎯 API Base URL: http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

module.exports = server; 