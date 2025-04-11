/**
 * Activation-related selectors for accessing the activations state
 */
import { createSelector } from 'reselect';
import { ORDER_STATUS, ORDER_TYPES } from '../../config';

// Basic selectors
export const getActivationsState = (state) => state.activations;
export const getActivationsList = (state) => state.activations.items || [];
export const getActivationsLoading = (state) => state.activations.loading;
export const getActivationsError = (state) => state.activations.error;
export const getTotalActivationsCount = (state) => state.activations.totalCount || 0;

// Get activation by ID
export const getActivationById = (state, activationId) => {
  const activations = getActivationsList(state);
  return activations.find(activation => activation.id.toString() === activationId.toString()) || null;
};

// Get activations by status
export const getActivationsByStatus = createSelector(
  [getActivationsList, (_, status) => status],
  (activations, status) => {
    if (!status) return activations;
    if (Array.isArray(status)) {
      return activations.filter(activation => status.includes(activation.status));
    }
    return activations.filter(activation => activation.status === status);
  }
);

// Get activations by building ID
export const getActivationsByBuilding = createSelector(
  [getActivationsList, (_, buildingId) => buildingId],
  (activations, buildingId) => {
    if (!buildingId) return activations;
    return activations.filter(activation => activation.buildingId.toString() === buildingId.toString());
  }
);

// Get activations by service installer ID
export const getActivationsByServiceInstaller = createSelector(
  [getActivationsList, (_, serviceInstallerId) => serviceInstallerId],
  (activations, serviceInstallerId) => {
    if (!serviceInstallerId) return activations;
    return activations.filter(activation => 
      activation.serviceInstallerId && 
      activation.serviceInstallerId.toString() === serviceInstallerId.toString()
    );
  }
);

// Get activations count by status
export const getActivationStatusCounts = createSelector(
  [getActivationsList],
  (activations) => {
    const counts = {
      [ORDER_STATUS.PENDING]: 0,
      [ORDER_STATUS.ASSIGNED]: 0,
      [ORDER_STATUS.IN_PROGRESS]: 0,
      [ORDER_STATUS.COMPLETED]: 0,
      [ORDER_STATUS.CANCELLED]: 0,
      total: activations.length,
    };
    
    activations.forEach(activation => {
      if (activation.status && counts[activation.status] !== undefined) {
        counts[activation.status]++;
      }
    });
    
    return counts;
  }
);

// Get activations count by subtype
export const getActivationSubtypeCounts = createSelector(
  [getActivationsList],
  (activations) => {
    const counts = {};
    let total = 0;
    
    activations.forEach(activation => {
      if (activation.orderType === ORDER_TYPES.ACTIVATION) {
        total++;
        const subtype = activation.orderSubType || 'DEFAULT';
        counts[subtype] = (counts[subtype] || 0) + 1;
      }
    });
    
    return { ...counts, total };
  }
);

// Get active connections (completed activations)
export const getActiveConnections = createSelector(
  [getActivationsList],
  (activations) => {
    return activations.filter(activation => 
      activation.orderType === ORDER_TYPES.ACTIVATION && 
      activation.status === ORDER_STATUS.COMPLETED
    );
  }
);

// Get activations by date range
export const getActivationsByDateRange = createSelector(
  [getActivationsList, (_, startDate, endDate) => ({ startDate, endDate })],
  (activations, { startDate, endDate }) => {
    if (!startDate && !endDate) return activations;
    
    return activations.filter(activation => {
      const activationDate = new Date(activation.appointmentDate);
      
      if (startDate && endDate) {
        return activationDate >= new Date(startDate) && activationDate <= new Date(endDate);
      } else if (startDate) {
        return activationDate >= new Date(startDate);
      } else if (endDate) {
        return activationDate <= new Date(endDate);
      }
      
      return true;
    });
  }
);

// Get today's activations
export const getTodaysActivations = createSelector(
  [getActivationsList],
  (activations) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return activations.filter(activation => {
      const activationDate = new Date(activation.appointmentDate);
      activationDate.setHours(0, 0, 0, 0);
      
      return activationDate.getTime() === today.getTime();
    });
  }
);

// Get this week's activations
export const getThisWeeksActivations = createSelector(
  [getActivationsList],
  (activations) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);
    
    return activations.filter(activation => {
      const activationDate = new Date(activation.appointmentDate);
      
      return activationDate >= startOfWeek && activationDate <= endOfWeek;
    });
  }
);

// Get unassigned activations
export const getUnassignedActivations = createSelector(
  [getActivationsList],
  (activations) => {
    return activations.filter(activation => 
      !activation.serviceInstallerId || 
      activation.serviceInstallerId === null || 
      activation.serviceInstallerId === ''
    );
  }
);

// Get activations without materials
export const getActivationsWithoutMaterials = createSelector(
  [getActivationsList],
  (activations) => {
    return activations.filter(activation => 
      !activation.materialsAssigned || 
      activation.materialsAssigned === false
    );
  }
);

// Search activations
export const searchActivations = createSelector(
  [getActivationsList, (_, query) => query],
  (activations, query) => {
    if (!query) return activations;
    
    const searchTerm = query.toLowerCase();
    return activations.filter(activation => 
      (activation.name && activation.name.toLowerCase().includes(searchTerm)) ||
      (activation.contactNo && activation.contactNo.toLowerCase().includes(searchTerm)) ||
      (activation.trbnNo && activation.trbnNo.toLowerCase().includes(searchTerm)) ||
      (activation.building && activation.building.toLowerCase().includes(searchTerm))
    );
  }
);

export default {
  getActivationsState,
  getActivationsList,
  getActivationsLoading,
  getActivationsError,
  getTotalActivationsCount,
  getActivationById,
  getActivationsByStatus,
  getActivationsByBuilding,
  getActivationsByServiceInstaller,
  getActivationStatusCounts,
  getActivationSubtypeCounts,
  getActiveConnections,
  getActivationsByDateRange,
  getTodaysActivations,
  getThisWeeksActivations,
  getUnassignedActivations,
  getActivationsWithoutMaterials,
  searchActivations
};