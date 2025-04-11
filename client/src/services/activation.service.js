/**
 * Activation service for API interactions
 */
import axios from 'axios';
import { API_URL } from '../config';

/**
 * Get all activations
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with activations data
 */
export const getAllActivations = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/activations`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching activations:', error);
    throw error;
  }
};

/**
 * Get an activation by ID
 * 
 * @param {string} id - Activation ID
 * @returns {Promise} - Promise with activation data
 */
export const getActivationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/activations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching activation with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new activation
 * 
 * @param {Object} activationData - Activation data
 * @returns {Promise} - Promise with created activation data
 */
export const createActivation = async (activationData) => {
  try {
    const response = await axios.post(`${API_URL}/activations`, activationData);
    return response.data;
  } catch (error) {
    console.error('Error creating activation:', error);
    throw error;
  }
};

/**
 * Update an activation
 * 
 * @param {string} id - Activation ID
 * @param {Object} activationData - Updated activation data
 * @returns {Promise} - Promise with updated activation data
 */
export const updateActivation = async (id, activationData) => {
  try {
    const response = await axios.put(`${API_URL}/activations/${id}`, activationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating activation with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an activation
 * 
 * @param {string} id - Activation ID
 * @returns {Promise} - Promise with response
 */
export const deleteActivation = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/activations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting activation with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search activations
 * 
 * @param {string} query - Search query
 * @returns {Promise} - Promise with search results
 */
export const searchActivations = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/activations/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching activations:', error);
    throw error;
  }
};

/**
 * Assign service installer to activation
 * 
 * @param {string} activationId - Activation ID
 * @param {string} serviceInstallerId - Service installer ID
 * @param {Object} assignmentData - Additional assignment data
 * @returns {Promise} - Promise with assignment data
 */
export const assignServiceInstaller = async (activationId, serviceInstallerId, assignmentData = {}) => {
  try {
    const response = await axios.post(`${API_URL}/activations/${activationId}/assign`, {
      serviceInstallerId,
      ...assignmentData
    });
    return response.data;
  } catch (error) {
    console.error(`Error assigning service installer to activation ${activationId}:`, error);
    throw error;
  }
};

/**
 * Update activation status
 * 
 * @param {string} id - Activation ID
 * @param {string} status - New status
 * @param {Object} statusData - Additional status data
 * @returns {Promise} - Promise with updated activation data
 */
export const updateActivationStatus = async (id, status, statusData = {}) => {
  try {
    const response = await axios.patch(`${API_URL}/activations/${id}/status`, {
      status,
      ...statusData
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for activation ${id}:`, error);
    throw error;
  }
};

/**
 * Get activation history
 * 
 * @param {string} id - Activation ID
 * @returns {Promise} - Promise with activation history data
 */
export const getActivationHistory = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/activations/${id}/history`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for activation ${id}:`, error);
    throw error;
  }
};

export default {
  getAllActivations,
  getActivationById,
  createActivation,
  updateActivation,
  deleteActivation,
  searchActivations,
  assignServiceInstaller,
  updateActivationStatus,
  getActivationHistory
};