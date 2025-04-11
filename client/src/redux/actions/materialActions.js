// src/redux/actions/materialActions.js
import {
  FETCH_MATERIALS_REQUEST,
  FETCH_MATERIALS_SUCCESS,
  FETCH_MATERIALS_FAILURE,
  FETCH_MATERIAL_REQUEST,
  FETCH_MATERIAL_SUCCESS,
  FETCH_MATERIAL_FAILURE,
  CREATE_MATERIAL_REQUEST,
  CREATE_MATERIAL_SUCCESS,
  CREATE_MATERIAL_FAILURE,
  UPDATE_MATERIAL_REQUEST,
  UPDATE_MATERIAL_SUCCESS,
  UPDATE_MATERIAL_FAILURE,
  DELETE_MATERIAL_REQUEST,
  DELETE_MATERIAL_SUCCESS,
  DELETE_MATERIAL_FAILURE,
  UPDATE_MATERIAL_STOCK_REQUEST,
  UPDATE_MATERIAL_STOCK_SUCCESS,
  UPDATE_MATERIAL_STOCK_FAILURE,
  FETCH_LOW_STOCK_MATERIALS_REQUEST,
  FETCH_LOW_STOCK_MATERIALS_SUCCESS,
  FETCH_LOW_STOCK_MATERIALS_FAILURE
} from './types';
import materialService from '../../services/material.service';
import { setAlert } from './uiActions';

/**
 * Fetch all materials
 * @param {Object} params - Query parameters for filtering
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchMaterials = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_MATERIALS_REQUEST });
    
    const response = await materialService.getAllMaterials(params);
    
    dispatch({
      type: FETCH_MATERIALS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    
    dispatch({
      type: FETCH_MATERIALS_FAILURE,
      payload: error.message || 'Failed to fetch materials'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch materials', 'error'));
    return null;
  }
};

/**
 * Fetch a single material by ID
 * @param {string|number} id - Material ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchMaterial = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_MATERIAL_REQUEST });
    
    const response = await materialService.getMaterialById(id);
    
    dispatch({
      type: FETCH_MATERIAL_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching material ${id}:`, error);
    
    dispatch({
      type: FETCH_MATERIAL_FAILURE,
      payload: error.message || 'Failed to fetch material'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch material details', 'error'));
    return null;
  }
};

/**
 * Create a new material
 * @param {Object} materialData - Material data to create
 * @returns {Function} - Thunk function that dispatches actions
 */
export const createMaterial = (materialData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_MATERIAL_REQUEST });
    
    const response = await materialService.createMaterial(materialData);
    
    dispatch({
      type: CREATE_MATERIAL_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Material created successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error('Error creating material:', error);
    
    dispatch({
      type: CREATE_MATERIAL_FAILURE,
      payload: error.message || 'Failed to create material'
    });
    
    dispatch(setAlert(error.message || 'Failed to create material', 'error'));
    return null;
  }
};

/**
 * Update an existing material
 * @param {string|number} id - Material ID
 * @param {Object} materialData - Material data to update
 * @returns {Function} - Thunk function that dispatches actions
 */
export const updateMaterial = (id, materialData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_MATERIAL_REQUEST });
    
    const response = await materialService.updateMaterial(id, materialData);
    
    dispatch({
      type: UPDATE_MATERIAL_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Material updated successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error updating material ${id}:`, error);
    
    dispatch({
      type: UPDATE_MATERIAL_FAILURE,
      payload: error.message || 'Failed to update material'
    });
    
    dispatch(setAlert(error.message || 'Failed to update material', 'error'));
    return null;
  }
};

/**
 * Delete a material
 * @param {string|number} id - Material ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const deleteMaterial = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_MATERIAL_REQUEST });
    
    const response = await materialService.deleteMaterial(id);
    
    dispatch({
      type: DELETE_MATERIAL_SUCCESS,
      payload: id
    });
    
    dispatch(setAlert('Material deleted successfully', 'success'));
    return true;
  } catch (error) {
    console.error(`Error deleting material ${id}:`, error);
    
    dispatch({
      type: DELETE_MATERIAL_FAILURE,
      payload: error.message || 'Failed to delete material'
    });
    
    dispatch(setAlert(error.message || 'Failed to delete material', 'error'));
    return false;
  }
};

/**
 * Add stock to material
 * @param {string|number} id - Material ID
 * @param {number} quantity - Quantity to add
 * @param {string} notes - Transaction notes
 * @returns {Function} - Thunk function that dispatches actions
 */
export const addStock = (id, quantity, notes = '') => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_MATERIAL_STOCK_REQUEST });
    
    const response = await materialService.addStock(id, quantity, notes);
    
    dispatch({
      type: UPDATE_MATERIAL_STOCK_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert(`Added ${quantity} units to stock`, 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error adding stock to material ${id}:`, error);
    
    dispatch({
      type: UPDATE_MATERIAL_STOCK_FAILURE,
      payload: error.message || 'Failed to add stock'
    });
    
    dispatch(setAlert(error.message || 'Failed to add stock', 'error'));
    return null;
  }
};

/**
 * Remove stock from material
 * @param {string|number} id - Material ID
 * @param {number} quantity - Quantity to remove
 * @param {string} notes - Transaction notes
 * @returns {Function} - Thunk function that dispatches actions
 */
export const removeStock = (id, quantity, notes = '') => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_MATERIAL_STOCK_REQUEST });
    
    const response = await materialService.removeStock(id, quantity, notes);
    
    dispatch({
      type: UPDATE_MATERIAL_STOCK_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert(`Removed ${quantity} units from stock`, 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error removing stock from material ${id}:`, error);
    
    dispatch({
      type: UPDATE_MATERIAL_STOCK_FAILURE,
      payload: error.message || 'Failed to remove stock'
    });
    
    dispatch(setAlert(error.message || 'Failed to remove stock', 'error'));
    return null;
  }
};

/**
 * Fetch materials with low stock
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchLowStockMaterials = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_LOW_STOCK_MATERIALS_REQUEST });
    
    const response = await materialService.getLowStockMaterials();
    
    dispatch({
      type: FETCH_LOW_STOCK_MATERIALS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock materials:', error);
    
    dispatch({
      type: FETCH_LOW_STOCK_MATERIALS_FAILURE,
      payload: error.message || 'Failed to fetch low stock materials'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch low stock materials', 'error'));
    return null;
  }
};

/**
 * Fetch out of stock materials
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchOutOfStockMaterials = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_MATERIALS_REQUEST });
    
    const response = await materialService.getOutOfStockMaterials();
    
    // Still using FETCH_MATERIALS_SUCCESS since we're fetching a subset of materials
    dispatch({
      type: FETCH_MATERIALS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching out of stock materials:', error);
    
    dispatch({
      type: FETCH_MATERIALS_FAILURE,
      payload: error.message || 'Failed to fetch out of stock materials'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch out of stock materials', 'error'));
    return null;
  }
};

/**
 * Assign materials to a job
 * @param {string|number} jobId - Job ID
 * @param {Array} materials - Array of material assignments
 * @param {string} notes - Assignment notes
 * @returns {Function} - Thunk function that dispatches actions
 */
export const assignMaterialsToJob = (jobId, materials, notes = '') => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_MATERIAL_STOCK_REQUEST });
    
    const response = await materialService.assignMaterialsToJob(jobId, materials, notes);
    
    dispatch({
      type: UPDATE_MATERIAL_STOCK_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Materials assigned successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error assigning materials to job ${jobId}:`, error);
    
    dispatch({
      type: UPDATE_MATERIAL_STOCK_FAILURE,
      payload: error.message || 'Failed to assign materials'
    });
    
    dispatch(setAlert(error.message || 'Failed to assign materials', 'error'));
    return null;
  }
};

/**
 * Get material stock history
 * @param {string|number} id - Material ID
 * @param {Object} params - Query parameters
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getMaterialStockHistory = (id, params = {}) => async (dispatch) => {
  try {
    // Using the general material request/success/failure for this operation
    dispatch({ type: FETCH_MATERIAL_REQUEST });
    
    const response = await materialService.getMaterialStockHistory(id, params);
    
    // We don't need to update any state for this, but we fulfill the promise
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock history for material ${id}:`, error);
    
    dispatch(setAlert(error.message || 'Failed to fetch stock history', 'error'));
    return null;
  }
};

/**
 * Search materials
 * @param {string} query - Search query
 * @returns {Function} - Thunk function that dispatches actions
 */
export const searchMaterials = (query) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_MATERIALS_REQUEST });
    
    const response = await materialService.searchMaterials(query);
    
    dispatch({
      type: FETCH_MATERIALS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error searching materials with query ${query}:`, error);
    
    dispatch({
      type: FETCH_MATERIALS_FAILURE,
      payload: error.message || 'Failed to search materials'
    });
    
    dispatch(setAlert(error.message || 'Failed to search materials', 'error'));
    return null;
  }
};

export default {
  fetchMaterials,
  fetchMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  addStock,
  removeStock,
  fetchLowStockMaterials,
  fetchOutOfStockMaterials,
  assignMaterialsToJob,
  getMaterialStockHistory,
  searchMaterials
};