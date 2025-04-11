/**
 * Invoice service for API interactions
 */
import axios from 'axios';
import { API_URL } from '../config';

/**
 * Get all invoices
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with invoices data
 */
export const getAllInvoices = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/invoices`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

/**
 * Get an invoice by ID
 * 
 * @param {string} id - Invoice ID
 * @returns {Promise} - Promise with invoice data
 */
export const getInvoiceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new invoice
 * 
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise} - Promise with created invoice data
 */
export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_URL}/invoices`, invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

/**
 * Update an invoice
 * 
 * @param {string} id - Invoice ID
 * @param {Object} invoiceData - Updated invoice data
 * @returns {Promise} - Promise with updated invoice data
 */
export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await axios.put(`${API_URL}/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating invoice with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an invoice
 * 
 * @param {string} id - Invoice ID
 * @returns {Promise} - Promise with response
 */
export const deleteInvoice = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting invoice with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search invoices
 * 
 * @param {string} query - Search query
 * @returns {Promise} - Promise with search results
 */
export const searchInvoices = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching invoices:', error);
    throw error;
  }
};

/**
 * Mark invoice as paid
 * 
 * @param {string} id - Invoice ID
 * @param {Object} paymentData - Payment data
 * @returns {Promise} - Promise with updated invoice data
 */
export const markInvoiceAsPaid = async (id, paymentData = {}) => {
  try {
    const response = await axios.post(`${API_URL}/invoices/${id}/pay`, paymentData);
    return response.data;
  } catch (error) {
    console.error(`Error marking invoice ${id} as paid:`, error);
    throw error;
  }
};

/**
 * Generate invoice PDF
 * 
 * @param {string} id - Invoice ID
 * @returns {Promise} - Promise with PDF data
 */
export const generateInvoicePdf = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error(`Error generating PDF for invoice ${id}:`, error);
    throw error;
  }
};

/**
 * Get invoice statistics
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with invoice statistics
 */
export const getInvoiceStatistics = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/statistics`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice statistics:', error);
    throw error;
  }
};

/**
 * Send invoice email
 * 
 * @param {string} id - Invoice ID
 * @param {Object} emailData - Email data
 * @returns {Promise} - Promise with response
 */
export const sendInvoiceEmail = async (id, emailData = {}) => {
  try {
    const response = await axios.post(`${API_URL}/invoices/${id}/email`, emailData);
    return response.data;
  } catch (error) {
    console.error(`Error sending email for invoice ${id}:`, error);
    throw error;
  }
};

export default {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  searchInvoices,
  markInvoiceAsPaid,
  generateInvoicePdf,
  getInvoiceStatistics,
  sendInvoiceEmail
};