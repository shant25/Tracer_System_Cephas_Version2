/**
 * Authentication controller for Tracer App
 */
const crypto = require('crypto');
const User = require('../models/user.model');
const { successResponse, ApiError, catchAsync } = require('../utils/apiResponse');
const logger = require('../utils/logger');
const emailService = require('../services/email.service');
const config = require('../config/env');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(400, 'Email already registered'));
  }
  
  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'user'
  });
  
  // Generate token
  const token = user.generateAuthToken();
  
  // Remove password from response
  user.password = undefined;
  
  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(user);
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    // Continue even if email fails
  }
  
  // Send response
  return successResponse(res, 201, 'User registered successfully', { user, token });
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Check if email and password exist
  if (!email || !password) {
    return next(new ApiError(400, 'Please provide email and password'));
  }
  
  // Find user by email and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  
  // Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError(401, 'Invalid email or password'));
  }
  
  // Check if user is active
  if (!user.isActive) {
    return next(new ApiError(401, 'Your account has been deactivated. Please contact support.'));
  }
  
  // Generate token
  const token = user.generateAuthToken();
  
  // Update last login time
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });
  
  // Remove password from response
  user.password = undefined;
  
  // Send response
  return successResponse(res, 200, 'Login successful', { user, token });
});

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  
  return successResponse(res, 200, 'User profile retrieved successfully', { user });
});

/**
 * Forgot password - send reset token
 * @route POST /api/auth/forgot-password
 * @access Public
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(404, 'No user found with that email address'));
  }
  
  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  
  // Save user with reset token
  await user.save({ validateBeforeSave: false });
  
  // Create password reset URL
  const resetURL = `${config.APP_URL}/reset-password/${resetToken}`;
  
  try {
    // Send password reset email
    await emailService.sendPasswordResetEmail(user, resetURL);
    
    return successResponse(res, 200, 'Password reset token sent to email', {
      message: 'Password reset instructions have been sent to your email address.'
    });
  } catch (error) {
    // If email fails, clear reset token and expiry
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    logger.error('Error sending password reset email:', error);
    return next(new ApiError(500, 'Error sending email. Please try again later.'));
  }
});

/**
 * Reset password with token
 * @route POST /api/auth/reset-password
 * @access Public
 */
const resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken, password } = req.body;
  
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
    return next(new ApiError(400, 'Password reset token is invalid or has expired'));
  }
  
  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  
  await user.save();
  
  // Send password changed confirmation email
  try {
    await emailService.sendPasswordChangedEmail(user);
  } catch (error) {
    logger.error('Error sending password changed email:', error);
    // Continue even if email fails
  }
  
  // Generate new token
  const token = user.generateAuthToken();
  
  // Send response
  return successResponse(res, 200, 'Password reset successful', { token });
});

/**
 * Change password
 * @route POST /api/auth/change-password
 * @access Private
 */
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await User.findById(req.user.id).select('+password');
  
  // Check if current password is correct
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ApiError(401, 'Current password is incorrect'));
  }
  
  // Update password
  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  
  await user.save();
  
  // Send password changed confirmation email
  try {
    await emailService.sendPasswordChangedEmail(user);
  } catch (error) {
    logger.error('Error sending password changed email:', error);
    // Continue even if email fails
  }
  
  // Generate new token
  const token = user.generateAuthToken();
  
  // Send response
  return successResponse(res, 200, 'Password changed successfully', { token });
});

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
const updateProfile = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  
  // Check if email is being changed and already exists
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'Email already in use'));
    }
  }
  
  // Update user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName: firstName || req.user.firstName,
      lastName: lastName || req.user.lastName,
      email: email || req.user.email,
      updatedAt: Date.now()
    },
    { new: true, runValidators: true }
  );
  
  // Send response
  return successResponse(res, 200, 'Profile updated successfully', { user });
});

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile
};