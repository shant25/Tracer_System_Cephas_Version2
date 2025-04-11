/**
 * Express server configuration for Tracer App
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./env');
const logger = require('../utils/logger');

/**
 * Initialize Express application with middleware
 * @returns {Object} Express application instance
 */
const initializeExpress = () => {
  const app = express();
  
  // Security middleware
  app.use(helmet());
  
  // Enable CORS
  app.use(cors());
  
  // Parse JSON requests
  app.use(express.json({ limit: config.UPLOAD_LIMIT }));
  
  // Parse URL-encoded requests
  app.use(express.urlencoded({ extended: true, limit: config.UPLOAD_LIMIT }));
  
  // Compress responses
  app.use(compression());
  
  // Request logging
  if (config.NODE_ENV !== 'test') {
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
  }
  
  return app;
};

module.exports = {
  initializeExpress
};