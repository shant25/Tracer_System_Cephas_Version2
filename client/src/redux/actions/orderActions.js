// src/redux/actions/orderActions.js
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_ORDER_REQUEST,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  ASSIGN_INSTALLER_REQUEST,
  ASSIGN_INSTALLER_SUCCESS,
  ASSIGN_INSTALLER_FAILURE
} from './types';
import orderService from '../../services/order.service';
import { setAlert } from './uiActions';

/**
 * Fetch all orders
 * @param {Object} params - Query parameters for filtering
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchOrders = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    
    const response = await orderService.getAllOrders(params);
    
    dispatch({
      type: FETCH_ORDERS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    dispatch({
      type: FETCH_ORDERS_FAILURE,
      payload: error.message || 'Failed to fetch orders'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch orders', 'error'));
    return null;
  }
};

/**
 * Fetch a single order by ID
 * @param {string|number} id - Order ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const fetchOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDER_REQUEST });
    
    const response = await orderService.getOrderById(id);
    
    dispatch({
      type: FETCH_ORDER_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    
    dispatch({
      type: FETCH_ORDER_FAILURE,
      payload: error.message || 'Failed to fetch order'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch order details', 'error'));
    return null;
  }
};

/**
 * Create a new order
 * @param {Object} orderData - Order data to create
 * @returns {Function} - Thunk function that dispatches actions
 */
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });
    
    const response = await orderService.createOrder(orderData);
    
    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Order created successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: error.message || 'Failed to create order'
    });
    
    dispatch(setAlert(error.message || 'Failed to create order', 'error'));
    return null;
  }
};

/**
 * Update an existing order
 * @param {string|number} id - Order ID
 * @param {Object} orderData - Order data to update
 * @returns {Function} - Thunk function that dispatches actions
 */
export const updateOrder = (id, orderData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_REQUEST });
    
    const response = await orderService.updateOrder(id, orderData);
    
    dispatch({
      type: UPDATE_ORDER_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Order updated successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    
    dispatch({
      type: UPDATE_ORDER_FAILURE,
      payload: error.message || 'Failed to update order'
    });
    
    dispatch(setAlert(error.message || 'Failed to update order', 'error'));
    return null;
  }
};

/**
 * Delete an order
 * @param {string|number} id - Order ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });
    
    const response = await orderService.deleteOrder(id);
    
    dispatch({
      type: DELETE_ORDER_SUCCESS,
      payload: id
    });
    
    dispatch(setAlert('Order deleted successfully', 'success'));
    return true;
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    
    dispatch({
      type: DELETE_ORDER_FAILURE,
      payload: error.message || 'Failed to delete order'
    });
    
    dispatch(setAlert(error.message || 'Failed to delete order', 'error'));
    return false;
  }
};

/**
 * Update order status
 * @param {string|number} id - Order ID
 * @param {string} status - New status
 * @param {Object} statusData - Additional status data
 * @returns {Function} - Thunk function that dispatches actions
 */
export const updateOrderStatus = (id, status, statusData = {}) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });
    
    const response = await orderService.updateOrderStatus(id, status, statusData);
    
    dispatch({
      type: UPDATE_ORDER_STATUS_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert(`Order status updated to ${status}`, 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error);
    
    dispatch({
      type: UPDATE_ORDER_STATUS_FAILURE,
      payload: error.message || 'Failed to update order status'
    });
    
    dispatch(setAlert(error.message || 'Failed to update order status', 'error'));
    return null;
  }
};

/**
 * Assign service installer to order
 * @param {string|number} orderId - Order ID
 * @param {string|number} serviceInstallerId - Service installer ID
 * @param {Object} assignmentData - Additional assignment data
 * @returns {Function} - Thunk function that dispatches actions
 */
export const assignServiceInstaller = (orderId, serviceInstallerId, assignmentData = {}) => async (dispatch) => {
  try {
    dispatch({ type: ASSIGN_INSTALLER_REQUEST });
    
    const response = await orderService.assignServiceInstaller(orderId, serviceInstallerId, assignmentData);
    
    dispatch({
      type: ASSIGN_INSTALLER_SUCCESS,
      payload: response.data
    });
    
    dispatch(setAlert('Service installer assigned successfully', 'success'));
    return response.data;
  } catch (error) {
    console.error(`Error assigning service installer to order ${orderId}:`, error);
    
    dispatch({
      type: ASSIGN_INSTALLER_FAILURE,
      payload: error.message || 'Failed to assign service installer'
    });
    
    dispatch(setAlert(error.message || 'Failed to assign service installer', 'error'));
    return null;
  }
};

/**
 * Search orders
 * @param {string} query - Search query
 * @param {Object} params - Additional params like pagination
 * @returns {Function} - Thunk function that dispatches actions
 */
export const searchOrders = (query, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    
    const response = await orderService.searchOrders(query);
    
    dispatch({
      type: FETCH_ORDERS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching orders:', error);
    
    dispatch({
      type: FETCH_ORDERS_FAILURE,
      payload: error.message || 'Failed to search orders'
    });
    
    dispatch(setAlert(error.message || 'Failed to search orders', 'error'));
    return null;
  }
};

/**
 * Get orders for a specific service installer
 * @param {string|number} serviceInstallerId - Service installer ID
 * @param {Object} params - Query parameters for filtering
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getOrdersByServiceInstaller = (serviceInstallerId, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    
    const response = await orderService.getOrdersByServiceInstaller(serviceInstallerId, params);
    
    dispatch({
      type: FETCH_ORDERS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for service installer ${serviceInstallerId}:`, error);
    
    dispatch({
      type: FETCH_ORDERS_FAILURE,
      payload: error.message || 'Failed to fetch orders for service installer'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch orders for service installer', 'error'));
    return null;
  }
};

/**
 * Get orders for a specific building
 * @param {string|number} buildingId - Building ID
 * @param {Object} params - Query parameters for filtering
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getOrdersByBuilding = (buildingId, params = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    
    const response = await orderService.getOrdersByBuilding(buildingId, params);
    
    dispatch({
      type: FETCH_ORDERS_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for building ${buildingId}:`, error);
    
    dispatch({
      type: FETCH_ORDERS_FAILURE,
      payload: error.message || 'Failed to fetch orders for building'
    });
    
    dispatch(setAlert(error.message || 'Failed to fetch orders for building', 'error'));
    return null;
  }
};

/**
 * Generate a job sheet for an order
 * @param {string|number} orderId - Order ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const generateJobSheet = (orderId) => async (dispatch) => {
  try {
    const response = await orderService.generateJobSheet(orderId);
    
    // Create a download link
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `job-sheet-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    dispatch(setAlert('Job sheet generated successfully', 'success'));
    return true;
  } catch (error) {
    console.error(`Error generating job sheet for order ${orderId}:`, error);
    dispatch(setAlert(error.message || 'Failed to generate job sheet', 'error'));
    return false;
  }
};

/**
 * Get order history
 * @param {string|number} orderId - Order ID
 * @returns {Function} - Thunk function that dispatches actions
 */
export const getOrderHistory = (orderId) => async (dispatch) => {
  try {
    const response = await orderService.getOrderHistory(orderId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for order ${orderId}:`, error);
    dispatch(setAlert(error.message || 'Failed to fetch order history', 'error'));
    return null;
  }
};