/**
 * Application middleware configuration for Tracer App
 */
const { errorHandler } = require('../middlewares/error.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');
const { authenticateToken } = require('../middlewares/auth.middleware');

/**
 * Configure application middleware
 * @param {Object} app - Express application instance
 */
const configureMiddleware = (app) => {
  // Common middleware
  
  // Error handling middleware (should be last)
  app.use(errorHandler);
};

module.exports = {
  configureMiddleware,
  authenticateToken,
  validateRequest
};