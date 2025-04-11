// src/redux/actions/buildingActions.js
import {
  FETCH_BUILDINGS_REQUEST,
  FETCH_BUILDINGS_SUCCESS,
  FETCH_BUILDINGS_FAILURE,
  FETCH_BUILDING_REQUEST,
  FETCH_BUILDING_SUCCESS,
  FETCH_BUILDING_FAILURE,
  CREATE_BUILDING_REQUEST,
  CREATE_BUILDING_SUCCESS,
  CREATE_BUILDING_FAILURE,
  UPDATE_BUILDING_REQUEST,
  UPDATE_BUILDING_SUCCESS,
  UPDATE_BUILDING_FAILURE,
  DELETE_BUILDING_REQUEST,
  DELETE_BUILDING_SUCCESS,
  DELETE_BUILDING_FAILURE
} from './types';
import buildingService from '../../services/building.service';
import { setAlert } from './uiActions';

/**
 * Fetch all buildings
 * @param {Object} params - Query parameters for filtering
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchBuildings = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BUILDINGS_REQUEST });
    
    const response = await buildingService.getAllBuildings(params);
    
    dispatch({
      type: FETCH_BUILDINGS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching buildings:', error);
    
    dispatch({
      type: FETCH_BUILDINGS_FAILURE,
      payload: error.message || 'Failed to fetch buildings'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch buildings', 'error'));
    return null;
  }
};

/**
 * Fetch a single building by ID
 * @param {string|number} id - Building ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchBuilding = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BUILDING_REQUEST });
    
    const response = await buildingService.getBuildingById(id);
    
    dispatch({
      type: FETCH_BUILDING_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching building ${id}:`, error);
    
    dispatch({
      type: FETCH_BUILDING_FAILURE,
      payload: error.message || 'Failed to fetch building'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch building details', 'error'));
    return null;
  }
};

/**
 * Create a new building
 * @param {Object} buildingData - Building data to create
 * @returns {Function} - Thunk function that dispatches actions
 */
export const createBuilding = (buildingData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_BUILDING_REQUEST });
    
    const response = await buildingService.createBuilding(buildingData);
    
    dispatch({
      type: CREATE_BUILDING_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Building created successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error('Error creating building:', error);
    
    dispatch({
      type: CREATE_BUILDING_FAILURE,
      payload: error.message || 'Failed to create building'
    });
    
    dispatch(setAlert(error.message || 'Failed to create building', 'error'));
    return null;
  }
};

/**
 * Update an existing building
 * @param {string|number} id - Building ID
 * @param {Object} buildingData - Building data to update
 * @returns {Function} - Thunk function that dispatches actions
 */
export const updateBuilding = (id, buildingData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BUILDING_REQUEST });
    
    const response = await buildingService.updateBuilding(id, buildingData);
    
    dispatch({
      type: UPDATE_BUILDING_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Building updated successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error updating building ${id}:`, error);
    
    dispatch({
      type: UPDATE_BUILDING_FAILURE,
      payload: error.message || 'Failed to update building'
    });
    
    dispatch(setAlert(error.message || 'Failed to update building', 'error'));
    return null;
  }
};

/**
 * Delete a building
 * @param {string|number} id - Building ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const deleteBuilding = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BUILDING_REQUEST });
    
    const response = await buildingService.deleteBuilding(id);
    
    dispatch({
      type: DELETE_BUILDING_SUCCESS,
      payload: id
    });
    
    dispatch(setAlert('Building deleted successfully', 'success'));
    return true;
  } catch (error) {
    console.error(`Error deleting building ${id}:`, error);
    
    dispatch({
      type: DELETE_BUILDING_FAILURE,
      payload: error.message || 'Failed to delete building'
    });
    
    dispatch(setAlert(error.message || 'Failed to delete building', 'error'));
    return false;
  }
};

/**
 * Search buildings
 * @param {string} query - Search query
 * @param {Object} params - Additional params like pagination
 * @returns {Function} - Thunk function that dispatches actions
 */
export const searchBuildings = (query, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BUILDINGS_REQUEST });
    
    const response = await buildingService.searchBuildings(query, params.page, params.limit);
    
    dispatch({
      type: FETCH_BUILDINGS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching buildings:', error);
    
    dispatch({
      type: FETCH_BUILDINGS_FAILURE,
      payload: error.message || 'Failed to search buildings'
    });
    
    dispatch(setAlert(error.message || 'Failed to search buildings', 'error'));
    return null;
  }
};

/**
 * Get all building types
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getBuildingTypes = () => async (dispatch) => {
  try {
    const response = await buildingService.getBuildingTypes();
    return response.data;
  } catch (error) {
    console.error('Error fetching building types:', error);
    dispatch(setAlert(error.message || 'Failed to fetch building types', 'error'));
    return null;
  }
};

/**
 * Get all building locations (returns unique locations from buildings)
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getBuildingLocations = () => (dispatch, getState) => {
  const { buildings } = getState().building;
  
  if (!buildings || buildings.length === 0) {
    return [];
  }
  
  // Extract unique locations
  const locations = [...new Set(buildings.map(building => building.location))];
  return locations;
};

/**
 * Export building data to CSV or Excel
 * @param {string|number} buildingId - Optional building ID (null for all)
 * @param {string} format - Export format ('csv', 'excel', 'pdf')
 * @returns {Function} - Thunk function that dispatches actions
 */
export const exportBuildingData = (buildingId = null, format = 'csv') => async (dispatch) => {
  try {
    const response = await buildingService.exportBuildingData(buildingId, format);
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename
    const filename = buildingId 
      ? `building_${buildingId}.${format}` 
      : `buildings_export.${format}`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    dispatch(setAlert(`Buildings exported to ${format.toUpperCase()} successfully`, 'success'));
    return true;
  } catch (error) {
    console.error('Error exporting building data:', error);
    dispatch(setAlert(error.message || 'Failed to export building data', 'error'));
    return false;
  }
};