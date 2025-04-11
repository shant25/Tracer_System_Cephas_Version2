/**
 * Service Installer service for API interactions
 */
import axios from 'axios';
import { API_URL } from '../config';

/**
 * Get all service installers
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with service installers data
 */
export const getAllServiceInstallers = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/service-installers`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching service installers:', error);
    throw error;
  }
};

/**
 * Get a service installer by ID
 * 
 * @param {string} id - Service installer ID
 * @returns {Promise} - Promise with service installer data
 */
export const getServiceInstallerById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/service-installers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service installer with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new service installer
 * 
 * @param {Object} installerData - Service installer data
 * @returns {Promise} - Promise with created service installer data
 */
export const createServiceInstaller = async (installerData) => {
  try {
    const response = await axios.post(`${API_URL}/service-installers`, installerData);
    return response.data;
  } catch (error) {
    console.error('Error creating service installer:', error);
    throw error;
  }
};

/**
 * Update a service installer
 * 
 * @param {string} id - Service installer ID
 * @param {Object} installerData - Updated service installer data
 * @returns {Promise} - Promise with updated service installer data
 */
export const updateServiceInstaller = async (id, installerData) => {
  try {
    const response = await axios.put(`${API_URL}/service-installers/${id}`, installerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating service installer with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a service installer
 * 
 * @param {string} id - Service installer ID
 * @returns {Promise} - Promise with response
 */
export const deleteServiceInstaller = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/service-installers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting service installer with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search service installers
 * 
 * @param {string} query - Search query
 * @returns {Promise} - Promise with search results
 */
export const searchServiceInstallers = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/service-installers/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching service installers:', error);
    throw error;
  }
};

/**
 * Get assignments for a service installer
 * 
 * @param {string} id - Service installer ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with assignments data
 */
export const getServiceInstallerAssignments = async (id, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/service-installers/${id}/assignments`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching assignments for service installer ${id}:`, error);
    throw error;
  }
};

/**
 * Get performance metrics for a service installer
 * 
 * @param {string} id - Service installer ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with performance data
 */
export const getServiceInstallerPerformance = async (id, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/service-installers/${id}/performance`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching performance data for service installer ${id}:`, error);
    throw error;
  }
};

/**
 * Update service installer status (active/inactive)
 * 
 * @param {string} id - Service installer ID
 * @param {boolean} isActive - Whether the installer is active
 * @returns {Promise} - Promise with updated service installer data
 */
export const updateServiceInstallerStatus = async (id, isActive) => {
  try {
    const response = await axios.patch(`${API_URL}/service-installers/${id}/status`, { isActive });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for service installer ${id}:`, error);
    throw error;
  }
};

export default {
  getAllServiceInstallers,
  getServiceInstallerById,
  createServiceInstaller,
  updateServiceInstaller,
  deleteServiceInstaller,
  searchServiceInstallers,
  getServiceInstallerAssignments,
  getServiceInstallerPerformance,
  updateServiceInstallerStatus
};