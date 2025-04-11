/**
 * User service for API interactions
 */
import axios from 'axios';
import { API_URL } from '../config';

/**
 * Get all users
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with users data
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/users`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a user by ID
 * 
 * @param {string} id - User ID
 * @returns {Promise} - Promise with user data
 */
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 * 
 * @param {Object} userData - User data
 * @returns {Promise} - Promise with created user data
 */
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update a user
 * 
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise} - Promise with updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 * 
 * @param {string} id - User ID
 * @returns {Promise} - Promise with response
 */
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search users
 * 
 * @param {string} query - Search query
 * @returns {Promise} - Promise with search results
 */
export const searchUsers = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/users/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Get user profile
 * 
 * @returns {Promise} - Promise with user profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 * 
 * @param {Object} profileData - Profile data
 * @returns {Promise} - Promise with updated profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/users/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Change password
 * 
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - Promise with response
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/users/change-password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Get user activity logs
 * 
 * @param {string} id - User ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with activity logs data
 */
export const getUserActivityLogs = async (id, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}/activity-logs`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching activity logs for user ${id}:`, error);
    throw error;
  }
};

/**
 * Get users by role
 * 
 * @param {string} role - User role
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with users data
 */
export const getUsersByRole = async (role, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/users/role/${role}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    throw error;
  }
};

/**
 * Update user status (active/inactive)
 * 
 * @param {string} id - User ID
 * @param {boolean} isActive - Whether the user is active
 * @returns {Promise} - Promise with updated user data
 */
export const updateUserStatus = async (id, isActive) => {
  try {
    const response = await axios.patch(`${API_URL}/users/${id}/status`, { isActive });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for user ${id}:`, error);
    throw error;
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserActivityLogs,
  getUsersByRole,
  updateUserStatus
};