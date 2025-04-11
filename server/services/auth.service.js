/**
 * Authentication service for Tracer App
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const { ApiError } = require('../utils/apiResponse');
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }
};

/**
 * Register a new user
 * @param {Object} userData - User data
 * @returns {Object} User and token
 */
const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }
    
    // Create user
    const user = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user'
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Remove password from response
    user.password = undefined;
    
    return { user, token };
  } catch (error) {
    logger.error('Error in registerUser service:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} User and token
 */
const loginUser = async (email, password) => {
  try {
    // Check if email and password are provided
    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }
    
    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(401, 'Your account has been deactivated. Please contact support.');
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Update last login time
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    
    // Remove password from response
    user.password = undefined;
    
    return { user, token };
  } catch (error) {
    logger.error('Error in loginUser service:', error);
    throw error;
  }
};

/**
 * Generate password reset token
 * @param {String} email - User email
 * @returns {String} Reset token
 */
const generatePasswordResetToken = async (email) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'No user found with that email address');
    }
    
    // Generate random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set expiry (10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    // Save user
    await user.save({ validateBeforeSave: false });
    
    return resetToken;
  } catch (error) {
    logger.error('Error in generatePasswordResetToken service:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {String} resetToken - Password reset token
 * @param {String} newPassword - New password
 * @returns {Boolean} Success status
 */
const resetPassword = async (resetToken, newPassword) => {
  try {
    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Find user by token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    // Check if token is valid and not expired
    if (!user) {
      throw new ApiError(400, 'Password reset token is invalid or has expired');
    }
    
    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    
    await user.save();
    
    return true;
  } catch (error) {
    logger.error('Error in resetPassword service:', error);
    throw error;
  }
};

/**
 * Change user password
 * @param {String} userId - User ID
 * @param {String} currentPassword - Current password
 * @param {String} newPassword - New password
 * @returns {Boolean} Success status
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Get user with password
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      throw new ApiError(401, 'Current password is incorrect');
    }
    
    // Update password
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    
    await user.save();
    
    return true;
  } catch (error) {
    logger.error('Error in changePassword service:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {String} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Object} Updated user
 */
const updateUserProfile = async (userId, userData) => {
  try {
    // Check if email is being changed and already exists
    if (userData.email) {
      const existingUser = await User.findOne({ 
        email: userData.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        throw new ApiError(400, 'Email already in use');
      }
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    return user;
  } catch (error) {
    logger.error('Error in updateUserProfile service:', error);
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  registerUser,
  loginUser,
  generatePasswordResetToken,
  resetPassword,
  changePassword,
  updateUserProfile
};