/**
 * Material service for API interactions
 */
import axios from 'axios';
import { API_URL } from '../config';

/**
 * Get all materials
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with materials data
 */
export const getAllMaterials = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/materials`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

/**
 * Get a material by ID
 * 
 * @param {string} id - Material ID
 * @returns {Promise} - Promise with material data
 */
export const getMaterialById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching material with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new material
 * 
 * @param {Object} materialData - Material data
 * @returns {Promise} - Promise with created material data
 */
export const createMaterial = async (materialData) => {
  try {
    const response = await axios.post(`${API_URL}/materials`, materialData);
    return response.data;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

/**
 * Update a material
 * 
 * @param {string} id - Material ID
 * @param {Object} materialData - Updated material data
 * @returns {Promise} - Promise with updated material data
 */
export const updateMaterial = async (id, materialData) => {
  try {
    const response = await axios.put(`${API_URL}/materials/${id}`, materialData);
    return response.data;
  } catch (error) {
    console.error(`Error updating material with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a material
 * 
 * @param {string} id - Material ID
 * @returns {Promise} - Promise with response
 */
export const deleteMaterial = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting material with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search materials by description or SAP code
 * 
 * @param {string} query - Search query
 * @returns {Promise} - Promise with search results
 */
export const searchMaterials = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/materials/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching materials:', error);
    throw error;
  }
};

/**
 * Add stock to a material
 * 
 * @param {string} id - Material ID
 * @param {number} quantity - Quantity to add
 * @param {string} notes - Transaction notes
 * @returns {Promise} - Promise with updated material data
 */
export const addStock = async (id, quantity, notes = '') => {
  try {
    const response = await axios.post(`${API_URL}/materials/${id}/add-stock`, {
      quantity,
      notes
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding stock to material ${id}:`, error);
    throw error;
  }
};

/**
 * Remove stock from a material
 * 
 * @param {string} id - Material ID
 * @param {number} quantity - Quantity to remove
 * @param {string} notes - Transaction notes
 * @returns {Promise} - Promise with updated material data
 */
export const removeStock = async (id, quantity, notes = '') => {
  try {
    const response = await axios.post(`${API_URL}/materials/${id}/remove-stock`, {
      quantity,
      notes
    });
    return response.data;
  } catch (error) {
    console.error(`Error removing stock from material ${id}:`, error);
    throw error;
  }
};

/**
 * Get material stock history
 * 
 * @param {string} id - Material ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with stock history data
 */
export const getMaterialStockHistory = async (id, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/materials/${id}/stock-history`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock history for material ${id}:`, error);
    throw error;
  }
};

/**
 * Assign materials to a job
 * 
 * @param {string} jobId - Job ID
 * @param {Array} materials - Array of material assignments
 * @param {string} notes - Assignment notes
 * @returns {Promise} - Promise with assignment data
 */
export const assignMaterialsToJob = async (jobId, materials, notes = '') => {
  try {
    const response = await axios.post(`${API_URL}/materials/assign`, {
      jobId,
      materials,
      notes
    });
    return response.data;
  } catch (error) {
    console.error(`Error assigning materials to job ${jobId}:`, error);
    throw error;
  }
};

/**
 * Get low stock materials
 * 
 * @returns {Promise} - Promise with low stock materials data
 */
export const getLowStockMaterials = async () => {
  try {
    const response = await axios.get(`${API_URL}/materials/low-stock`);
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock materials:', error);
    throw error;
  }
};

/**
 * Get out of stock materials
 * 
 * @returns {Promise} - Promise with out of stock materials data
 */
export const getOutOfStockMaterials = async () => {
  try {
    const response = await axios.get(`${API_URL}/materials/out-of-stock`);
    return response.data;
  } catch (error) {
    console.error('Error fetching out of stock materials:', error);
    throw error;
  }
};

export default {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  searchMaterials,
  addStock,
  removeStock,
  getMaterialStockHistory,
  assignMaterialsToJob,
  getLowStockMaterials,
  getOutOfStockMaterials
};