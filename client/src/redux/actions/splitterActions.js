// src/redux/actions/splitterActions.js
import {
  FETCH_SPLITTERS_REQUEST,
  FETCH_SPLITTERS_SUCCESS,
  FETCH_SPLITTERS_FAILURE,
  FETCH_SPLITTER_REQUEST,
  FETCH_SPLITTER_SUCCESS,
  FETCH_SPLITTER_FAILURE,
  CREATE_SPLITTER_REQUEST,
  CREATE_SPLITTER_SUCCESS,
  CREATE_SPLITTER_FAILURE,
  UPDATE_SPLITTER_REQUEST,
  UPDATE_SPLITTER_SUCCESS,
  UPDATE_SPLITTER_FAILURE,
  DELETE_SPLITTER_REQUEST,
  DELETE_SPLITTER_SUCCESS,
  DELETE_SPLITTER_FAILURE,
  FETCH_BUILDING_SPLITTERS_REQUEST,
  FETCH_BUILDING_SPLITTERS_SUCCESS,
  FETCH_BUILDING_SPLITTERS_FAILURE,
  ASSIGN_SERVICE_TO_PORT_REQUEST,
  ASSIGN_SERVICE_TO_PORT_SUCCESS,
  ASSIGN_SERVICE_TO_PORT_FAILURE,
  RELEASE_PORT_REQUEST,
  RELEASE_PORT_SUCCESS,
  RELEASE_PORT_FAILURE,
  CHECK_PORT_AVAILABILITY_REQUEST,
  CHECK_PORT_AVAILABILITY_SUCCESS,
  CHECK_PORT_AVAILABILITY_FAILURE
} from './types';
import splitterService from '../../services/splitter.service';
import { setAlert } from './uiActions';

/**
 * Fetch all splitters
 * @param {Object} params - Query parameters for filtering
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchSplitters = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SPLITTERS_REQUEST });
    
    const response = await splitterService.getAllSplitters(params);
    
    dispatch({
      type: FETCH_SPLITTERS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching splitters:', error);
    
    dispatch({
      type: FETCH_SPLITTERS_FAILURE,
      payload: error.message || 'Failed to fetch splitters'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch splitters', 'error'));
    return null;
  }
};

/**
 * Fetch a single splitter by ID
 * @param {string|number} id - Splitter ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchSplitter = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SPLITTER_REQUEST });
    
    const response = await splitterService.getSplitterById(id);
    
    dispatch({
      type: FETCH_SPLITTER_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching splitter ${id}:`, error);
    
    dispatch({
      type: FETCH_SPLITTER_FAILURE,
      payload: error.message || 'Failed to fetch splitter'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch splitter details', 'error'));
    return null;
  }
};

/**
 * Create a new splitter
 * @param {Object} splitterData - Splitter data to create
 * @returns {Function} - Thunk function that dispatches actions
 */
export const createSplitter = (splitterData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_SPLITTER_REQUEST });
    
    const response = await splitterService.createSplitter(splitterData);
    
    dispatch({
      type: CREATE_SPLITTER_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Splitter created successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error('Error creating splitter:', error);
    
    dispatch({
      type: CREATE_SPLITTER_FAILURE,
      payload: error.message || 'Failed to create splitter'
    });
    
    dispatch(setAlert(error.message || 'Failed to create splitter', 'error'));
    return null;
  }
};

/**
 * Update an existing splitter
 * @param {string|number} id - Splitter ID
 * @param {Object} splitterData - Splitter data to update
 * @returns {Function} - Thunk function that dispatches actions
 */
export const updateSplitter = (id, splitterData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SPLITTER_REQUEST });
    
    const response = await splitterService.updateSplitter(id, splitterData);
    
    dispatch({
      type: UPDATE_SPLITTER_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Splitter updated successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error updating splitter ${id}:`, error);
    
    dispatch({
      type: UPDATE_SPLITTER_FAILURE,
      payload: error.message || 'Failed to update splitter'
    });
    
    dispatch(setAlert(error.message || 'Failed to update splitter', 'error'));
    return null;
  }
};

/**
 * Delete a splitter
 * @param {string|number} id - Splitter ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const deleteSplitter = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SPLITTER_REQUEST });
    
    await splitterService.deleteSplitter(id);
    
    dispatch({
      type: DELETE_SPLITTER_SUCCESS,
      payload: id
    });
    
    dispatch(setAlert('Splitter deleted successfully', 'success'));
    return true;
  } catch (error) {
    console.error(`Error deleting splitter ${id}:`, error);
    
    dispatch({
      type: DELETE_SPLITTER_FAILURE,
      payload: error.message || 'Failed to delete splitter'
    });
    
    dispatch(setAlert(error.message || 'Failed to delete splitter', 'error'));
    return false;
  }
};

/**
 * Fetch splitters by building
 * @param {string|number} buildingId - Building ID
 * @param {Object} params - Query parameters
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchSplittersByBuilding = (buildingId, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BUILDING_SPLITTERS_REQUEST });
    
    const response = await splitterService.getSplittersByBuilding(buildingId, params);
    
    dispatch({
      type: FETCH_BUILDING_SPLITTERS_SUCCESS,
      payload: {
        buildingId,
        splitters: response.data
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching splitters for building ${buildingId}:`, error);
    
    dispatch({
      type: FETCH_BUILDING_SPLITTERS_FAILURE,
      payload: error.message || 'Failed to fetch building splitters'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch building splitters', 'error'));
    return null;
  }
};

/**
 * Get splitter by service ID
 * @param {string} serviceId - Service ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getSplitterByServiceId = (serviceId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SPLITTER_REQUEST });
    
    const response = await splitterService.getSplitterByServiceId(serviceId);
    
    dispatch({
      type: FETCH_SPLITTER_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching splitter for service ${serviceId}:`, error);
    
    dispatch({
      type: FETCH_SPLITTER_FAILURE,
      payload: error.message || 'Failed to fetch splitter'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch splitter', 'error'));
    return null;
  }
};

/**
 * Check splitter port availability
 * @param {string|number} splitterId - Splitter ID
 * @param {number} port - Port number
 * @returns {Function} - Thunk function that dispatches actions
 */
export const checkPortAvailability = (splitterId, port) => async (dispatch) => {
  try {
    dispatch({ type: CHECK_PORT_AVAILABILITY_REQUEST });
    
    const response = await splitterService.checkPortAvailability(splitterId, port);
    
    dispatch({
      type: CHECK_PORT_AVAILABILITY_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error checking port availability for splitter ${splitterId}:`, error);
    
    dispatch({
      type: CHECK_PORT_AVAILABILITY_FAILURE,
      payload: error.message || 'Failed to check port availability'
    });
    
    dispatch(setAlert(error.message || 'Failed to check port availability', 'error'));
    return null;
  }
};

/**
 * Assign service to splitter port
 * @param {string|number} splitterId - Splitter ID
 * @param {number} port - Port number
 * @param {string} serviceId - Service ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const assignServiceToPort = (splitterId, port, serviceId) => async (dispatch) => {
  try {
    dispatch({ type: ASSIGN_SERVICE_TO_PORT_REQUEST });
    
    const response = await splitterService.assignServiceToPort(splitterId, port, serviceId);
    
    dispatch({
      type: ASSIGN_SERVICE_TO_PORT_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Service assigned to port successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error assigning service to splitter port:`, error);
    
    dispatch({
      type: ASSIGN_SERVICE_TO_PORT_FAILURE,
      payload: error.message || 'Failed to assign service to port'
    });
    
    dispatch(setAlert(error.message || 'Failed to assign service to port', 'error'));
    return null;
  }
};

/**
 * Release splitter port
 * @param {string|number} splitterId - Splitter ID
 * @param {number} port - Port number
 * @returns {Function} - Thunk function that dispatches actions
 */
export const releasePort = (splitterId, port) => async (dispatch) => {
  try {
    dispatch({ type: RELEASE_PORT_REQUEST });
    
    const response = await splitterService.releasePort(splitterId, port);
    
    dispatch({
      type: RELEASE_PORT_SUCCESS,
      payload: {
        splitterId,
        port,
        ...response.data
      }
    });
    
    dispatch(setAlert('Port released successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error releasing splitter port:`, error);
    
    dispatch({
      type: RELEASE_PORT_FAILURE,
      payload: error.message || 'Failed to release port'
    });
    
    dispatch(setAlert(error.message || 'Failed to release port', 'error'));
    return null;
  }
};

/**
 * Get splitter utilization
 * @param {string|number} splitterId - Splitter ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getSplitterUtilization = (splitterId) => async (dispatch) => {
  try {
    // We'll use the general splitter request for this operation
    dispatch({ type: FETCH_SPLITTER_REQUEST });
    
    const response = await splitterService.getSplitterUtilization(splitterId);
    
    // Just return the data without dispatching a success action
    return response.data;
  } catch (error) {
    console.error(`Error fetching utilization for splitter ${splitterId}:`, error);
    dispatch(setAlert(error.message || 'Failed to fetch splitter utilization', 'error'));
    return null;
  }
};

/**
 * Search splitters
 * @param {string} query - Search query
 * @returns {Function} - Thunk function that dispatches actions
 */
export const searchSplitters = (query) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SPLITTERS_REQUEST });
    
    const response = await splitterService.searchSplitters(query);
    
    dispatch({
      type: FETCH_SPLITTERS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error searching splitters with query ${query}:`, error);
    
    dispatch({
      type: FETCH_SPLITTERS_FAILURE,
      payload: error.message || 'Failed to search splitters'
    });
    
    dispatch(setAlert(error.message || 'Failed to search splitters', 'error'));
    return null;
  }
};

export default {
  fetchSplitters,
  fetchSplitter,
  createSplitter,
  updateSplitter,
  deleteSplitter,
  fetchSplittersByBuilding,
  getSplitterByServiceId,
  checkPortAvailability,
  assignServiceToPort,
  releasePort,
  getSplitterUtilization,
  searchSplitters
};