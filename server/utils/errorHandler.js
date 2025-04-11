/**
 * Error handling utilities for Tracer App
 */
const config = require('../config/env');
const logger = require('./logger');
const { ApiError } = require('./apiResponse');

/**
 * Handle uncaught exceptions
 * @param {Error} error - Uncaught exception
 */
const handleUncaughtException = (error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(error.name, error.message, error.stack);
  
  // Exit process with failure
  process.exit(1);
};

/**
 * Handle unhandled rejections
 * @param {Error} error - Unhandled rejection
 */
const handleUnhandledRejection = (error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(error.name, error.message, error.stack);
  
  // Exit process with failure (give server time to finish pending requests)
  setTimeout(() => {
    process.exit(1);
  }, 1000);
};

/**
 * Handle MongoDB duplicate key error
 * @param {Error} err - MongoDB error
 * @returns {ApiError} Formatted API error
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${value}. Please use another value for ${field}.`;
  
  return new ApiError(400, message);
};

/**
 * Handle MongoDB validation error
 * @param {Error} err - MongoDB error
 * @returns {ApiError} Formatted API error
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(val => val.message);
  const message = `Validation error: ${errors.join(', ')}`;
  
  return new ApiError(400, message);
};

/**
 * Handle MongoDB cast error
 * @param {Error} err - MongoDB error
 * @returns {ApiError} Formatted API error
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  
  return new ApiError(400, message);
};

/**
 * Handle JWT errors
 * @param {Error} err - JWT error
 * @returns {ApiError} Formatted API error
 */
const handleJwtError = (err) => {
  let message = 'Invalid token. Please log in again.';
  
  if (err.name === 'TokenExpiredError') {
    message = 'Your token has expired. Please log in again.';
  }
  
  return new ApiError(401, message);
};

/**
 * Handle Multer errors
 * @param {Error} err - Multer error
 * @returns {ApiError} Formatted API error
 */
const handleMulterError = (err) => {
  let message = 'File upload error.';
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File too large. Maximum size is 10MB.';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    message = 'Too many files. Maximum is 5.';
  }
  
  return new ApiError(400, message);
};

/**
 * Parse error and return appropriate ApiError
 * @param {Error} err - Error object
 * @returns {ApiError} Formatted API error
 */
const parseError = (err) => {
  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    return handleDuplicateKeyError(err);
  }
  
  // MongoDB Validation Error
  if (err.name === 'ValidationError') {
    return handleValidationError(err);
  }
  
  // MongoDB Cast Error
  if (err.name === 'CastError') {
    return handleCastError(err);
  }
  
  // JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return handleJwtError(err);
  }
  
  // Multer Errors
  if (err.name === 'MulterError') {
    return handleMulterError(err);
  }
  
  // If error is already an ApiError, return it
  if (err instanceof ApiError) {
    return err;
  }
  
  // Default to 500 Internal Server Error
  return new ApiError(500, 'Something went wrong. Please try again later.', false);
};

// Set up error handlers
const setupErrorHandlers = () => {
  // Handle uncaught exceptions
  process.on('uncaughtException', handleUncaughtException);
  
  // Handle unhandled rejections
  process.on('unhandledRejection', handleUnhandledRejection);
};

module.exports = {
  handleUncaughtException,
  handleUnhandledRejection,
  handleDuplicateKeyError,
  handleValidationError,
  handleCastError,
  handleJwtError,
  handleMulterError,
  parseError,
  setupErrorHandlers
};