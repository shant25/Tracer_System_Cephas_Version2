/**
 * Environment variables configuration
 */
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
const envFile = process.env.NODE_ENV 
  ? `.env.${process.env.NODE_ENV}` 
  : '.env';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/tracer_app',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // Email configuration
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  
  // Application URL
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:5000',
  
  // File upload limits
  UPLOAD_LIMIT: process.env.UPLOAD_LIMIT || '5mb',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};