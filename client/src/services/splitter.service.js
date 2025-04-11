/**
 * Splitter service for API interactions
 */
import axios from 'axios';
import { API_URL } from '../config';

/**
 * Get all splitters
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with splitters data
 */
export const getAllSplitters = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/splitters`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching splitters:', error);
    throw error;
  }
};

/**
 * Get a splitter by ID
 * 
 * @param {string} id - Splitter ID
 * @returns {Promise} - Promise with splitter data
 */
export const getSplitterById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/splitters/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching splitter with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new splitter
 * 
 * @param {Object} splitterData - Splitter data
 * @returns {Promise} - Promise with created splitter data
 */
export const createSplitter = async (splitterData) => {
  try {
    const response = await axios.post(`${API_URL}/splitters`, splitterData);
    return response.data;
  } catch (error) {
    console.error('Error creating splitter:', error);
    throw error;
  }
};

/**
 * Update a splitter
 * 
 * @param {string} id - Splitter ID
 * @param {Object} splitterData - Updated splitter data
 * @returns {Promise} - Promise with updated splitter data
 */
export const updateSplitter = async (id, splitterData) => {
  try {
    const response = await axios.put(`${API_URL}/splitters/${id}`, splitterData);
    return response.data;
  } catch (error) {
    console.error(`Error updating splitter with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a splitter
 * 
 * @param {string} id - Splitter ID
 * @returns {Promise} - Promise with response
 */
export const deleteSplitter = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/splitters/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting splitter with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search splitters
 * 
 * @param {string} query - Search query
 * @returns {Promise} - Promise with search results
 */
export const searchSplitters = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/splitters/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching splitters:', error);
    throw error;
  }
};

/**
 * Get splitters by building
 * 
 * @param {string} buildingId - Building ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with splitters data
 */
export const getSplittersByBuilding = async (buildingId, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/splitters/building/${buildingId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching splitters for building ${buildingId}:`, error);
    throw error;
  }
};

/**
 * Get splitters by service ID
 * 
 * @param {string} serviceId - Service ID
 * @returns {Promise} - Promise with splitter data
 */
export const getSplitterByServiceId = async (serviceId) => {
  try {
    const response = await axios.get(`${API_URL}/splitters/service/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching splitter for service ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Check splitter port availability
 * 
 * @param {string} splitterId - Splitter ID
 * @param {number} port - Port number
 * @returns {Promise} - Promise with availability data
 */
export const checkPortAvailability = async (splitterId, port) => {
  try {
    const response = await axios.get(`${API_URL}/splitters/${splitterId}/ports/${port}/availability`);
    return response.data;
  } catch (error) {
    console.error(`Error checking port availability for splitter ${splitterId}:`, error);
    throw error;
  }
};

/**
 * Assign service to splitter port
 * 
 * @param {string} splitterId - Splitter ID
 * @param {number} port - Port number
 * @param {string} serviceId - Service ID
 * @returns {Promise} - Promise with assignment data
 */
export const assignServiceToPort = async (splitterId, port, serviceId) => {
  try {
    const response = await axios.post(`${API_URL}/splitters/${splitterId}/ports/${port}/assign`, {
      serviceId
    });
    return response.data;
  } catch (error) {
    console.error(`Error assigning service to splitter port:`, error);
    throw error;
  }
};

/**
 * Release splitter port
 * 
 * @param {string} splitterId - Splitter ID
 * @param {number} port - Port number
 * @returns {Promise} - Promise with response
 */
export const releasePort = async (splitterId, port) => {
  try {
    const response = await axios.post(`${API_URL}/splitters/${splitterId}/ports/${port}/release`);
    return response.data;
  } catch (error) {
    console.error(`Error releasing splitter port:`, error);
    throw error;
  }
};

/**
 * Get splitter utilization statistics
 * 
 * @param {string} splitterId - Splitter ID
 * @returns {Promise} - Promise with utilization data
 */
export const getSplitterUtilization = async (splitterId) => {
  try {
    const response = await axios.get(`${API_URL}/splitters/${splitterId}/utilization`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching utilization for splitter ${splitterId}:`, error);
    throw error;
  }
};

/**
 * Get building splitter utilization statistics
 * 
 * @param {string} buildingId - Building ID
 * @returns {Promise} - Promise with utilization data
 */
export const getBuildingSplitterUtilization = async (buildingId) => {
  try {
    const response = await axios.get(`${API_URL}/splitters/building/${buildingId}/utilization`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching splitter utilization for building ${buildingId}:`, error);
    throw error;
  }
};

export default {
  getAllSplitters,
  getSplitterById,
  createSplitter,
  updateSplitter,
  deleteSplitter,
  searchSplitters,
  getSplittersByBuilding,
  getSplitterByServiceId,
  checkPortAvailability,
  assignServiceToPort,
  releasePort,
  getSplitterUtilization,
  getBuildingSplitterUtilization
};