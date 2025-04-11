/**
 * Logger utility for Tracer App
 * Provides consistent logging across the application
 */
const winston = require('winston');
const config = require('../config/env');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack || ''}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    })
  ]
});

// Add file transports for production environment
if (config.NODE_ENV === 'production') {
  logger.add(
    // Log errors to a separate file
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    // Log all levels to combined log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    })
  );
}

// Create log dir if it doesn't exist and we're in production
const fs = require('fs');
const path = require('path');
if (config.NODE_ENV === 'production') {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
}

module.exports = logger;