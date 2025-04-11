/**
 * Order service for API interactions
 */
import axios from 'axios';
import { API_URL } from '../config';

/**
 * Get all orders
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with orders data
 */
export const getAllOrders = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get an order by ID
 * 
 * @param {string} id - Order ID
 * @returns {Promise} - Promise with order data
 */
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new order
 * 
 * @param {Object} orderData - Order data
 * @returns {Promise} - Promise with created order data
 */
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update an order
 * 
 * @param {string} id - Order ID
 * @param {Object} orderData - Updated order data
 * @returns {Promise} - Promise with updated order data
 */
export const updateOrder = async (id, orderData) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an order
 * 
 * @param {string} id - Order ID
 * @returns {Promise} - Promise with response
 */
export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search orders
 * 
 * @param {string} query - Search query
 * @returns {Promise} - Promise with search results
 */
export const searchOrders = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/orders/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching orders:', error);
    throw error;
  }
};

/**
 * Assign service installer to order
 * 
 * @param {string} orderId - Order ID
 * @param {string} serviceInstallerId - Service installer ID
 * @param {Object} assignmentData - Additional assignment data
 * @returns {Promise} - Promise with assignment data
 */
export const assignServiceInstaller = async (orderId, serviceInstallerId, assignmentData = {}) => {
  try {
    const response = await axios.post(`${API_URL}/orders/${orderId}/assign`, {
      serviceInstallerId,
      ...assignmentData
    });
    return response.data;
  } catch (error) {
    console.error(`Error assigning service installer to order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Update order status
 * 
 * @param {string} id - Order ID
 * @param {string} status - New status
 * @param {Object} statusData - Additional status data
 * @returns {Promise} - Promise with updated order data
 */
export const updateOrderStatus = async (id, status, statusData = {}) => {
  try {
    const response = await axios.patch(`${API_URL}/orders/${id}/status`, {
      status,
      ...statusData
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error);
    throw error;
  }
};

/**
 * Get order history
 * 
 * @param {string} id - Order ID
 * @returns {Promise} - Promise with order history data
 */
export const getOrderHistory = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}/history`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for order ${id}:`, error);
    throw error;
  }
};

/**
 * Get orders for service installer
 * 
 * @param {string} serviceInstallerId - Service installer ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with orders data
 */
export const getOrdersByServiceInstaller = async (serviceInstallerId, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/orders/service-installer/${serviceInstallerId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for service installer ${serviceInstallerId}:`, error);
    throw error;
  }
};

/**
 * Get orders by building
 * 
 * @param {string} buildingId - Building ID
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with orders data
 */
export const getOrdersByBuilding = async (buildingId, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/orders/building/${buildingId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for building ${buildingId}:`, error);
    throw error;
  }
};

/**
 * Generate job sheet
 * 
 * @param {string} id - Order ID
 * @returns {Promise} - Promise with job sheet data
 */
export const generateJobSheet = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}/job-sheet`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error(`Error generating job sheet for order ${id}:`, error);
    throw error;
  }
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  searchOrders,
  assignServiceInstaller,
  updateOrderStatus,
  getOrderHistory,
  getOrdersByServiceInstaller,
  getOrdersByBuilding,
  generateJobSheet
};