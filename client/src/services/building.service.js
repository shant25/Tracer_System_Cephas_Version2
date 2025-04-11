/**
 * Building Service
 * Handles CRUD operations for buildings and related data
 */
import apiService from './api';

/**
 * Building service methods
 */
const buildingService = {
  /**
   * Get all buildings with optional filtering
   * @param {object} filters - Query parameters for filtering
   * @param {number} page - Page number for pagination
   * @param {number} limit - Items per page
   * @param {string} sortBy - Field to sort by
   * @param {string} sortOrder - Sort order (asc or desc)
   * @returns {Promise} - Promise with buildings data
   */
  getAllBuildings: async (filters = {}, page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc') => {
    try {
      const params = {
        ...filters,
        page,
        limit,
        sortBy,
        sortOrder
      };
      
      return await apiService.get('/buildings', params);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      throw error;
    }
  },
  
  /**
   * Get a building by ID
   * @param {string|number} id - Building ID
   * @returns {Promise} - Promise with building data
   */
  getBuildingById: async (id) => {
    try {
      return await apiService.get(`/buildings/${id}`);
    } catch (error) {
      console.error(`Error fetching building with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new building
   * @param {object} buildingData - Building data
   * @returns {Promise} - Promise with created building data
   */
  createBuilding: async (buildingData) => {
    try {
      return await apiService.post('/buildings', buildingData);
    } catch (error) {
      console.error('Error creating building:', error);
      throw error;
    }
  },
  
  /**
   * Update a building
   * @param {string|number} id - Building ID
   * @param {object} buildingData - Updated building data
   * @returns {Promise} - Promise with updated building data
   */
  updateBuilding: async (id, buildingData) => {
    try {
      return await apiService.put(`/buildings/${id}`, buildingData);
    } catch (error) {
      console.error(`Error updating building with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a building
   * @param {string|number} id - Building ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteBuilding: async (id) => {
    try {
      return await apiService.delete(`/buildings/${id}`);
    } catch (error) {
      console.error(`Error deleting building with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get all building types
   * @returns {Promise} - Promise with building types data
   */
  getBuildingTypes: async () => {
    try {
      return await apiService.get('/buildings/types');
    } catch (error) {
      console.error('Error fetching building types:', error);
      throw error;
    }
  },
  
  /**
   * Search buildings by name, location, or type
   * @param {string} query - Search query
   * @param {number} page - Page number for pagination
   * @param {number} limit - Items per page
   * @returns {Promise} - Promise with search results
   */
  searchBuildings: async (query, page = 1, limit = 10) => {
    try {
      const params = {
        q: query,
        page,
        limit
      };
      
      return await apiService.get('/buildings/search', params);
    } catch (error) {
      console.error('Error searching buildings:', error);
      throw error;
    }
  },
  
  /**
   * Get all splitters for a building
   * @param {string|number} buildingId - Building ID
   * @param {object} filters - Query parameters for filtering
   * @returns {Promise} - Promise with splitters data
   */
  getBuildingSplitters: async (buildingId, filters = {}) => {
    try {
      return await apiService.get(`/buildings/${buildingId}/splitters`, filters);
    } catch (error) {
      console.error(`Error fetching splitters for building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Add a splitter to a building
   * @param {string|number} buildingId - Building ID
   * @param {object} splitterData - Splitter data
   * @returns {Promise} - Promise with created splitter data
   */
  addBuildingSplitter: async (buildingId, splitterData) => {
    try {
      return await apiService.post(`/buildings/${buildingId}/splitters`, splitterData);
    } catch (error) {
      console.error(`Error adding splitter to building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get all customers for a building
   * @param {string|number} buildingId - Building ID
   * @param {object} filters - Query parameters for filtering
   * @returns {Promise} - Promise with customers data
   */
  getBuildingCustomers: async (buildingId, filters = {}) => {
    try {
      return await apiService.get(`/buildings/${buildingId}/customers`, filters);
    } catch (error) {
      console.error(`Error fetching customers for building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get building statistics
   * @param {string|number} buildingId - Building ID
   * @returns {Promise} - Promise with building statistics data
   */
  getBuildingStatistics: async (buildingId) => {
    try {
      return await apiService.get(`/buildings/${buildingId}/statistics`);
    } catch (error) {
      console.error(`Error fetching statistics for building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Upload an image for a building
   * @param {string|number} buildingId - Building ID
   * @param {File} imageFile - Image file to upload
   * @param {function} onProgress - Progress callback function
   * @returns {Promise} - Promise with upload response
   */
  uploadBuildingImage: async (buildingId, imageFile, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      return await apiService.upload(`/buildings/${buildingId}/images`, formData, onProgress);
    } catch (error) {
      console.error(`Error uploading image for building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get all images for a building
   * @param {string|number} buildingId - Building ID
   * @returns {Promise} - Promise with building images data
   */
  getBuildingImages: async (buildingId) => {
    try {
      return await apiService.get(`/buildings/${buildingId}/images`);
    } catch (error) {
      console.error(`Error fetching images for building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete an image from a building
   * @param {string|number} buildingId - Building ID
   * @param {string|number} imageId - Image ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteBuildingImage: async (buildingId, imageId) => {
    try {
      return await apiService.delete(`/buildings/${buildingId}/images/${imageId}`);
    } catch (error) {
      console.error(`Error deleting image ${imageId} from building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Add a service area to a building
   * @param {string|number} buildingId - Building ID
   * @param {object} serviceAreaData - Service area data
   * @returns {Promise} - Promise with created service area data
   */
  addServiceArea: async (buildingId, serviceAreaData) => {
    try {
      return await apiService.post(`/buildings/${buildingId}/service-areas`, serviceAreaData);
    } catch (error) {
      console.error(`Error adding service area to building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get all service areas for a building
   * @param {string|number} buildingId - Building ID
   * @returns {Promise} - Promise with service areas data
   */
  getServiceAreas: async (buildingId) => {
    try {
      return await apiService.get(`/buildings/${buildingId}/service-areas`);
    } catch (error) {
      console.error(`Error fetching service areas for building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Update a service area
   * @param {string|number} buildingId - Building ID
   * @param {string|number} areaId - Service area ID
   * @param {object} serviceAreaData - Updated service area data
   * @returns {Promise} - Promise with updated service area data
   */
  updateServiceArea: async (buildingId, areaId, serviceAreaData) => {
    try {
      return await apiService.put(`/buildings/${buildingId}/service-areas/${areaId}`, serviceAreaData);
    } catch (error) {
      console.error(`Error updating service area ${areaId} in building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a service area
   * @param {string|number} buildingId - Building ID
   * @param {string|number} areaId - Service area ID
   * @returns {Promise} - Promise with deletion response
   */
  deleteServiceArea: async (buildingId, areaId) => {
    try {
      return await apiService.delete(`/buildings/${buildingId}/service-areas/${areaId}`);
    } catch (error) {
      console.error(`Error deleting service area ${areaId} from building ${buildingId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get all buildings with available capacity
   * @param {object} filters - Query parameters for filtering
   * @returns {Promise} - Promise with buildings data
   */
  getBuildingsWithCapacity: async (filters = {}) => {
    try {
      return await apiService.get('/buildings/with-capacity', filters);
    } catch (error) {
      console.error('Error fetching buildings with capacity:', error);
      throw error;
    }
  },
  
  /**
   * Export building data
   * @param {string|number} buildingId - Building ID (optional, exports all if not provided)
   * @param {string} format - Export format (csv, excel, pdf)
   * @param {function} onProgress - Progress callback function
   * @returns {Promise} - Promise with export data (Blob)
   */
  exportBuildingData: async (buildingId = null, format = 'csv', onProgress = null) => {
    try {
      const url = buildingId ? `/buildings/${buildingId}/export` : '/buildings/export';
      const params = { format };
      
      return await apiService.download(url, params, onProgress);
    } catch (error) {
      console.error('Error exporting building data:', error);
      throw error;
    }
  }
};

export default buildingService;