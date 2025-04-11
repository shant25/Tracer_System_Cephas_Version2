/**
 * Database configuration for Tracer App
 */
const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

/** 
 * Connect to MongoDB
 * @returns {Promise} Mongoose connection promise
 */
const connectDatabase = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    // Connect to MongoDB
    const connection = await mongoose.connect(config.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

/**
 * Close database connection
 * @returns {Promise} Mongoose disconnect promise
 */
const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error(`Error closing MongoDB connection: ${error.message}`);
    throw error;
  }
};

module.exports = {
  connectDatabase,
  closeDatabase
};