/**
 * User controller for Tracer App
 */
const User = require('../models/user.model');
const { successResponse, ApiError, catchAsync } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Get all users
 * @route GET /api/users
 * @access Private/Admin
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  // Get query parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  let query = {};
  
  // Filter by active/inactive
  if (req.query.active === 'true') {
    query.isActive = true;
  } else if (req.query.active === 'false') {
    query.isActive = false;
  }
  
  // Filter by role
  if (req.query.role) {
    query.role = req.query.role;
  }
  
  // Search by name or email
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query = {
      ...query,
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ]
    };
  }
  
  // Count total users
  const total = await User.countDocuments(query);
  
  // Get users
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  // Calculate pagination info
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return successResponse(res, 200, 'Users retrieved successfully', {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev
    }
  });
});

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private/Admin
 */
const getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  
  const user = await User.findById(userId);
  
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }
  
  return successResponse(res, 200, 'User retrieved successfully', { user });
});

/**
 * Create new user (admin only)
 * @route POST /api/users
 * @access Private/Admin
 */
const createUser = catchAsync(async (req, res, next) => {
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
  
  // Remove password from response
  user.password = undefined;
  
  return successResponse(res, 201, 'User created successfully', { user });
});

/**
 * Update user
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const { firstName, lastName, email, role, isActive } = req.body;
  
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }
  
  // Check if email is being changed and already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'Email already in use'));
    }
  }
  
  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  
  user.updatedAt = Date.now();
  
  // Save user
  await user.save();
  
  return successResponse(res, 200, 'User updated successfully', { user });
});

/**
 * Delete user
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  
  // Prevent deleting your own account
  if (userId === req.user.id) {
    return next(new ApiError(400, 'You cannot delete your own account'));
  }
  
  const user = await User.findById(userId);
  
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }
  
  await User.findByIdAndDelete(userId);
  
  return successResponse(res, 200, 'User deleted successfully');
});

/**
 * Get user stats
 * @route GET /api/users/stats
 * @access Private/Admin
 */
const getUserStats = catchAsync(async (req, res, next) => {
  // Get total user count
  const totalUsers = await User.countDocuments();
  
  // Get user count by role
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Get active/inactive user count
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  
  // Get new users (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  // Format role stats
  const roleStats = {};
  usersByRole.forEach(role => {
    roleStats[role._id] = role.count;
  });
  
  return successResponse(res, 200, 'User statistics retrieved successfully', {
    totalUsers,
    activeUsers,
    inactiveUsers,
    newUsers,
    roleStats
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
};