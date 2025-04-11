/**
 * Error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new Error(message);
    return res.status(400).json({
      success: false,
      message
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field}`;
    error = new Error(message);
    return res.status(400).json({
      success: false,
      message
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new Error(message);
    return res.status(404).json({
      success: false,
      message
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new Error(message);
    return res.status(401).json({
      success: false,
      message
    });
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new Error(message);
    return res.status(401).json({
      success: false,
      message
    });
  }

  // Return the appropriate error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorMiddleware;