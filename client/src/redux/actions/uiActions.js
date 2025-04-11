// src/redux/actions/uiActions.js
import { v4 as uuidv4 } from 'uuid';
import {
  SET_ALERT,
  REMOVE_ALERT,
  TOGGLE_SIDEBAR,
  SET_LOADING,
  SET_PAGE_TITLE,
  CLEAR_ALERTS,
  TOGGLE_THEME,
  SET_LANGUAGE,
  OPEN_MODAL,
  CLOSE_MODAL
} from './types';

/**
 * Set an alert message
 * @param {string} message - Alert message
 * @param {string} alertType - Alert type (success, error, warning, info)
 * @param {number} timeout - Auto-dismiss timeout in milliseconds
 * @returns {Function} - Thunk function that dispatches actions
 */
export const setAlert = (message, alertType = 'info', timeout = 5000) => (dispatch) => {
  const id = uuidv4();
  
  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      message,
      alertType
    }
  });
  
  if (timeout !== 0) {
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: id
      });
    }, timeout);
  }
  
  return id;
};

/**
 * Remove a specific alert by ID
 * @param {string} id - Alert ID
 * @returns {Object} - Action object
 */
export const removeAlert = (id) => ({
  type: REMOVE_ALERT,
  payload: id
});

/**
 * Clear all alerts
 * @returns {Object} - Action object
 */
export const clearAlerts = () => ({
  type: CLEAR_ALERTS
});

/**
 * Toggle sidebar visibility
 * @returns {Object} - Action object
 */
export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR
});

/**
 * Set global loading state
 * @param {boolean} isLoading - Whether the application is in a loading state
 * @returns {Object} - Action object
 */
export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading
});

/**
 * Set page title
 * @param {string} title - Page title
 * @returns {Object} - Action object
 */
export const setPageTitle = (title) => ({
  type: SET_PAGE_TITLE,
  payload: title
});

/**
 * Toggle between light and dark theme
 * @returns {Object} - Action object
 */
export const toggleTheme = () => ({
  type: TOGGLE_THEME
});

/**
 * Set application language
 * @param {string} language - Language code (e.g., 'en', 'ms')
 * @returns {Object} - Action object
 */
export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  payload: language
});

/**
 * Open a modal
 * @param {string} modalId - Modal identifier
 * @param {Object} modalProps - Modal properties
 * @returns {Object} - Action object
 */
export const openModal = (modalId, modalProps = {}) => ({
  type: OPEN_MODAL,
  payload: {
    modalId,
    modalProps
  }
});

/**
 * Close a modal
 * @param {string} modalId - Modal identifier
 * @returns {Object} - Action object
 */
export const closeModal = (modalId) => ({
  type: CLOSE_MODAL,
  payload: modalId
});

export default {
  setAlert,
  removeAlert,
  clearAlerts,
  toggleSidebar,
  setLoading,
  setPageTitle,
  toggleTheme,
  setLanguage,
  openModal,
  closeModal
};