// src/redux/actions/activationActions.js
import {
  FETCH_ACTIVATIONS_REQUEST,
  FETCH_ACTIVATIONS_SUCCESS,
  FETCH_ACTIVATIONS_FAILURE,
  FETCH_ACTIVATION_REQUEST,
  FETCH_ACTIVATION_SUCCESS,
  FETCH_ACTIVATION_FAILURE,
  CREATE_ACTIVATION_REQUEST,
  CREATE_ACTIVATION_SUCCESS,
  CREATE_ACTIVATION_FAILURE,
  UPDATE_ACTIVATION_REQUEST,
  UPDATE_ACTIVATION_SUCCESS,
  UPDATE_ACTIVATION_FAILURE,
  DELETE_ACTIVATION_REQUEST,
  DELETE_ACTIVATION_SUCCESS,
  DELETE_ACTIVATION_FAILURE,
  UPDATE_ACTIVATION_STATUS_REQUEST,
  UPDATE_ACTIVATION_STATUS_SUCCESS,
  UPDATE_ACTIVATION_STATUS_FAILURE,
  ASSIGN_ACTIVATION_MATERIALS_REQUEST,
  ASSIGN_ACTIVATION_MATERIALS_SUCCESS,
  ASSIGN_ACTIVATION_MATERIALS_FAILURE
} from './types';
import activationService from '../../services/activation.service';
import { setAlert } from './uiActions';

/**
 * Fetch all activations
 * @param {Object} params - Query parameters for filtering
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchActivations = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ACTIVATIONS_REQUEST });
    
    const response = await activationService.getAllActivations(params);
    
    dispatch({
      type: FETCH_ACTIVATIONS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching activations:', error);
    
    dispatch({
      type: FETCH_ACTIVATIONS_FAILURE,
      payload: error.message || 'Failed to fetch activations'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch activations', 'error'));
    return null;
  }
};

/**
 * Fetch a single activation by ID
 * @param {string|number} id - Activation ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchActivation = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ACTIVATION_REQUEST });
    
    const response = await activationService.getActivationById(id);
    
    dispatch({
      type: FETCH_ACTIVATION_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching activation ${id}:`, error);
    
    dispatch({
      type: FETCH_ACTIVATION_FAILURE,
      payload: error.message || 'Failed to fetch activation'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch activation details', 'error'));
    return null;
  }
};

/**
 * Create a new activation
 * @param {Object} activationData - Activation data to create
 * @returns {Function} - Thunk function that dispatches actions
 */
export const createActivation = (activationData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ACTIVATION_REQUEST });
    
    const response = await activationService.createActivation(activationData);
    
    dispatch({
      type: CREATE_ACTIVATION_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Activation created successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error('Error creating activation:', error);
    
    dispatch({
      type: CREATE_ACTIVATION_FAILURE,
      payload: error.message || 'Failed to create activation'
    });
    
    dispatch(setAlert(error.message || 'Failed to create activation', 'error'));
    return null;
  }
};

/**
 * Update an existing activation
 * @param {string|number} id - Activation ID
 * @param {Object} activationData - Activation data to update
 * @returns {Function} - Thunk function that dispatches actions
 */
export const updateActivation = (id, activationData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ACTIVATION_REQUEST });
    
    const response = await activationService.updateActivation(id, activationData);
    
    dispatch({
      type: UPDATE_ACTIVATION_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Activation updated successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error updating activation ${id}:`, error);
    
    dispatch({
      type: UPDATE_ACTIVATION_FAILURE,
      payload: error.message || 'Failed to update activation'
    });
    
    dispatch(setAlert(error.message || 'Failed to update activation', 'error'));
    return null;
  }
};

/**
 * Delete an activation
 * @param {string|number} id - Activation ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const deleteActivation = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ACTIVATION_REQUEST });
    
    const response = await activationService.deleteActivation(id);
    
    dispatch({
      type: DELETE_ACTIVATION_SUCCESS,
      payload: id
    });
    
    dispatch(setAlert('Activation deleted successfully', 'success'));
    return true;
  } catch (error) {
    console.error(`Error deleting activation ${id}:`, error);
    
    dispatch({
      type: DELETE_ACTIVATION_FAILURE,
      payload: error.message || 'Failed to delete activation'
    });
    
    dispatch(setAlert(error.message || 'Failed to delete activation', 'error'));
    return false;
  }
};

/**
 * Update activation status
 * @param {string|number} id - Activation ID
 * @param {string} status - New status
 * @param {Object} statusData - Additional status data
 * @returns {Function} - Thunk function that dispatches actions
 */
export const updateActivationStatus = (id, status, statusData = {}) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ACTIVATION_STATUS_REQUEST });
    
    const response = await activationService.updateActivationStatus(id, status, statusData);
    
    dispatch({
      type: UPDATE_ACTIVATION_STATUS_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert(`Activation status updated to ${status}`, 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error updating status for activation ${id}:`, error);
    
    dispatch({
      type: UPDATE_ACTIVATION_STATUS_FAILURE,
      payload: error.message || 'Failed to update activation status'
    });
    
    dispatch(setAlert(error.message || 'Failed to update activation status', 'error'));
    return null;
  }
};

/**
 * Assign service installer to activation
 * @param {string|number} activationId - Activation ID
 * @param {string|number} serviceInstallerId - Service installer ID
 * @param {Object} assignmentData - Additional assignment data
 * @returns {Function} - Thunk function that dispatches actions
 */
export const assignServiceInstaller = (activationId, serviceInstallerId, assignmentData = {}) => async (dispatch) => {
  try {
    const response = await activationService.assignServiceInstaller(activationId, serviceInstallerId, assignmentData);
    
    dispatch({
      type: UPDATE_ACTIVATION_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Service installer assigned successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error assigning service installer to activation ${activationId}:`, error);
    dispatch(setAlert(error.message || 'Failed to assign service installer', 'error'));
    return null;
  }
};

/**
 * Assign materials to activation
 * @param {string|number} activationId - Activation ID
 * @param {Array} materials - Materials to assign
 * @param {string} notes - Assignment notes
 * @returns {Function} - Thunk function that dispatches actions
 */
export const assignMaterials = (activationId, materials, notes = '') => async (dispatch) => {
  try {
    dispatch({ type: ASSIGN_ACTIVATION_MATERIALS_REQUEST });
    
    // Format materials data
    const materialsData = {
      activationId,
      materials,
      notes
    };
    
    // Call your material assignment service
    const response = await activationService.assignActivationMaterials(activationId, materialsData);
    
    dispatch({
      type: ASSIGN_ACTIVATION_MATERIALS_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Materials assigned successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error assigning materials to activation ${activationId}:`, error);
    
    dispatch({
      type: ASSIGN_ACTIVATION_MATERIALS_FAILURE,
      payload: error.message || 'Failed to assign materials'
    });
    
    dispatch(setAlert(error.message || 'Failed to assign materials', 'error'));
    return null;
  }
};

/**
 * Search activations
 * @param {string} query - Search query
 * @returns {Function} - Thunk function that dispatches actions
 */
export const searchActivations = (query) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ACTIVATIONS_REQUEST });
    
    const response = await activationService.searchActivations(query);
    
    dispatch({
      type: FETCH_ACTIVATIONS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching activations:', error);
    
    dispatch({
      type: FETCH_ACTIVATIONS_FAILURE,
      payload: error.message || 'Failed to search activations'
    });
    
    dispatch(setAlert(error.message || 'Failed to search activations', 'error'));
    return null;
  }
};

/**
 * Get activation history
 * @param {string|number} activationId - Activation ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getActivationHistory = (activationId) => async (dispatch) => {
  try {
    const response = await activationService.getActivationHistory(activationId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for activation ${activationId}:`, error);
    dispatch(setAlert(error.message || 'Failed to fetch activation history', 'error'));
    return null;
  }
};