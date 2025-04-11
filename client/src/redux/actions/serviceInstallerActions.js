// src/redux/actions/serviceInstallerActions.js
import {
  FETCH_SERVICE_INSTALLERS_REQUEST,
  FETCH_SERVICE_INSTALLERS_SUCCESS,
  FETCH_SERVICE_INSTALLERS_FAILURE,
  FETCH_SERVICE_INSTALLER_REQUEST,
  FETCH_SERVICE_INSTALLER_SUCCESS,
  FETCH_SERVICE_INSTALLER_FAILURE,
  CREATE_SERVICE_INSTALLER_REQUEST,
  CREATE_SERVICE_INSTALLER_SUCCESS,
  CREATE_SERVICE_INSTALLER_FAILURE,
  UPDATE_SERVICE_INSTALLER_REQUEST,
  UPDATE_SERVICE_INSTALLER_SUCCESS,
  UPDATE_SERVICE_INSTALLER_FAILURE,
  DELETE_SERVICE_INSTALLER_REQUEST,
  DELETE_SERVICE_INSTALLER_SUCCESS,
  DELETE_SERVICE_INSTALLER_FAILURE,
  UPDATE_SERVICE_INSTALLER_STATUS_REQUEST,
  UPDATE_SERVICE_INSTALLER_STATUS_SUCCESS,
  UPDATE_SERVICE_INSTALLER_STATUS_FAILURE,
  FETCH_SERVICE_INSTALLER_ASSIGNMENTS_REQUEST,
  FETCH_SERVICE_INSTALLER_ASSIGNMENTS_SUCCESS,
  FETCH_SERVICE_INSTALLER_ASSIGNMENTS_FAILURE,
  FETCH_SERVICE_INSTALLER_PERFORMANCE_REQUEST,
  FETCH_SERVICE_INSTALLER_PERFORMANCE_SUCCESS,
  FETCH_SERVICE_INSTALLER_PERFORMANCE_FAILURE
} from './types';
import serviceInstallerService from '../../services/serviceInstaller.service';
import { setAlert } from './uiActions';

/**
 * Fetch all service installers
 * @param {Object} params - Query parameters for filtering
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchServiceInstallers = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SERVICE_INSTALLERS_REQUEST });
    
    const response = await serviceInstallerService.getAllServiceInstallers(params);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLERS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching service installers:', error);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLERS_FAILURE,
      payload: error.message || 'Failed to fetch service installers'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch service installers', 'error'));
    return null;
  }
};

/**
 * Fetch a single service installer by ID
 * @param {string|number} id - Service installer ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchServiceInstaller = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SERVICE_INSTALLER_REQUEST });
    
    const response = await serviceInstallerService.getServiceInstallerById(id);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLER_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching service installer ${id}:`, error);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLER_FAILURE,
      payload: error.message || 'Failed to fetch service installer'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch service installer details', 'error'));
    return null;
  }
};

/**
 * Create a new service installer
 * @param {Object} installerData - Service installer data to create
 * @returns {Function} - Thunk function that dispatches actions
 */
export const createServiceInstaller = (installerData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_SERVICE_INSTALLER_REQUEST });
    
    const response = await serviceInstallerService.createServiceInstaller(installerData);
    
    dispatch({
      type: CREATE_SERVICE_INSTALLER_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Service installer created successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error('Error creating service installer:', error);
    
    dispatch({
      type: CREATE_SERVICE_INSTALLER_FAILURE,
      payload: error.message || 'Failed to create service installer'
    });
    
    dispatch(setAlert(error.message || 'Failed to create service installer', 'error'));
    return null;
  }
};

/**
 * Update an existing service installer
 * @param {string|number} id - Service installer ID
 * @param {Object} installerData - Service installer data to update
 * @returns {Function} - Thunk function that dispatches actions
 */
export const updateServiceInstaller = (id, installerData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SERVICE_INSTALLER_REQUEST });
    
    const response = await serviceInstallerService.updateServiceInstaller(id, installerData);
    
    dispatch({
      type: UPDATE_SERVICE_INSTALLER_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Service installer updated successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error updating service installer ${id}:`, error);
    
    dispatch({
      type: UPDATE_SERVICE_INSTALLER_FAILURE,
      payload: error.message || 'Failed to update service installer'
    });
    
    dispatch(setAlert(error.message || 'Failed to update service installer', 'error'));
    return null;
  }
};

/**
 * Delete a service installer
 * @param {string|number} id - Service installer ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const deleteServiceInstaller = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SERVICE_INSTALLER_REQUEST });
    
    await serviceInstallerService.deleteServiceInstaller(id);
    
    dispatch({
      type: DELETE_SERVICE_INSTALLER_SUCCESS,
      payload: id
    });
    
    dispatch(setAlert('Service installer deleted successfully', 'success'));
    return true;
  } catch (error) {
    console.error(`Error deleting service installer ${id}:`, error);
    
    dispatch({
      type: DELETE_SERVICE_INSTALLER_FAILURE,
      payload: error.message || 'Failed to delete service installer'
    });
    
    dispatch(setAlert(error.message || 'Failed to delete service installer', 'error'));
    return false;
  }
};

/**
 * Update service installer status (active/inactive)
 * @param {string|number} id - Service installer ID
 * @param {boolean} isActive - Whether the installer is active
 * @returns {Function} - Thunk function that dispatches actions
 */
export const updateServiceInstallerStatus = (id, isActive) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SERVICE_INSTALLER_STATUS_REQUEST });
    
    const response = await serviceInstallerService.updateServiceInstallerStatus(id, isActive);
    
    dispatch({
      type: UPDATE_SERVICE_INSTALLER_STATUS_SUCCESS,
      payload: response.data
    });
    
    const statusText = isActive ? 'activated' : 'deactivated';
    dispatch(setAlert(`Service installer ${statusText} successfully`, 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error updating status for service installer ${id}:`, error);
    
    dispatch({
      type: UPDATE_SERVICE_INSTALLER_STATUS_FAILURE,
      payload: error.message || 'Failed to update service installer status'
    });
    
    dispatch(setAlert(error.message || 'Failed to update service installer status', 'error'));
    return null;
  }
};

/**
 * Get assignments for a service installer
 * @param {string|number} id - Service installer ID
 * @param {Object} params - Query parameters
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getServiceInstallerAssignments = (id, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SERVICE_INSTALLER_ASSIGNMENTS_REQUEST });
    
    const response = await serviceInstallerService.getServiceInstallerAssignments(id, params);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLER_ASSIGNMENTS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching assignments for service installer ${id}:`, error);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLER_ASSIGNMENTS_FAILURE,
      payload: error.message || 'Failed to fetch service installer assignments'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch service installer assignments', 'error'));
    return null;
  }
};

/**
 * Get performance metrics for a service installer
 * @param {string|number} id - Service installer ID
 * @param {Object} params - Query parameters
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getServiceInstallerPerformance = (id, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SERVICE_INSTALLER_PERFORMANCE_REQUEST });
    
    const response = await serviceInstallerService.getServiceInstallerPerformance(id, params);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLER_PERFORMANCE_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching performance data for service installer ${id}:`, error);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLER_PERFORMANCE_FAILURE,
      payload: error.message || 'Failed to fetch service installer performance'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch service installer performance', 'error'));
    return null;
  }
};

/**
 * Search service installers
 * @param {string} query - Search query
 * @returns {Function} - Thunk function that dispatches actions
 */
export const searchServiceInstallers = (query) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SERVICE_INSTALLERS_REQUEST });
    
    const response = await serviceInstallerService.searchServiceInstallers(query);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLERS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error searching service installers with query ${query}:`, error);
    
    dispatch({
      type: FETCH_SERVICE_INSTALLERS_FAILURE,
      payload: error.message || 'Failed to search service installers'
    });
    
    dispatch(setAlert(error.message || 'Failed to search service installers', 'error'));
    return null;
  }
};

export default {
  fetchServiceInstallers,
  fetchServiceInstaller,
  createServiceInstaller,
  updateServiceInstaller,
  deleteServiceInstaller,
  updateServiceInstallerStatus,
  getServiceInstallerAssignments,
  getServiceInstallerPerformance,
  searchServiceInstallers
};