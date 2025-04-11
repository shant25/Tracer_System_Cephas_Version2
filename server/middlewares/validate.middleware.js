/**
 * Request validation middleware for Tracer App
 */
const { ApiError } = require('../utils/apiResponse');

/**
 * Validate request based on provided schema
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, params, query)
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    // Get data from request based on property
    const data = req[property];
    
    // Validate data against schema
    const { error, value } = schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true,
      errors: { 
        wrap: { label: '' } 
      }
    });
    
    if (error) {
      // Extract error messages
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      return next(new ApiError(400, `Validation error: ${errorMessages}`));
    }
    
    // Replace request data with validated data
    req[property] = value;
    next();
  };
};

module.exports = {
  validateRequest
};