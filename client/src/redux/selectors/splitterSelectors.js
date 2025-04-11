/**
 * Splitter-related selectors for accessing the splitters state
 */
import { createSelector } from 'reselect';
import { getBuildingById } from './buildingSelectors';

// Basic selectors
export const getSplittersState = (state) => state.splitters;
export const getSplittersList = (state) => state.splitters.items || [];
export const getSplittersLoading = (state) => state.splitters.loading;
export const getSplittersError = (state) => state.splitters.error;
export const getTotalSplittersCount = (state) => state.splitters.totalCount || 0;

// Get splitter by ID
export const getSplitterById = (state, splitterId) => {
  const splitters = getSplittersList(state);
  return splitters.find(splitter => splitter.id.toString() === splitterId.toString()) || null;
};

// Get splitters by building ID
export const getSplittersByBuilding = createSelector(
  [getSplittersList, (_, buildingId) => buildingId],
  (splitters, buildingId) => {
    if (!buildingId) return splitters;
    return splitters.filter(splitter => splitter.buildingId.toString() === buildingId.toString());
  }
);

// Get splitter by service ID
export const getSplitterByServiceId = createSelector(
  [getSplittersList, (_, serviceId) => serviceId],
  (splitters, serviceId) => {
    if (!serviceId) return null;
    return splitters.find(splitter => splitter.serviceId === serviceId) || null;
  }
);

// Get splitter with building info
export const getSplitterWithBuilding = createSelector(
  [getSplitterById, (state, _, buildingId) => getBuildingById(state, buildingId)],
  (splitter, building) => {
    if (!splitter) return null;
    
    return {
      ...splitter,
      buildingName: building ? building.name : 'Unknown Building',
      buildingLocation: building ? building.location : null
    };
  }
);

// Get splitter port status
export const getSplitterStatus = createSelector(
  [getSplitterById],
  (splitter) => {
    if (!splitter) return null;
    
    // Default port count if not specified
    const portCount = splitter.portCount || 32;
    // Default port status if not specified
    const portStatus = splitter.portStatus || {};
    
    // Calculate usage stats
    let usedPorts = 0;
    let availablePorts = 0;
    
    // Count used and available ports
    for (let i = 1; i <= portCount; i++) {
      if (portStatus[i] && portStatus[i].isUsed) {
        usedPorts++;
      } else {
        availablePorts++;
      }
    }
    
    return {
      portCount,
      usedPorts,
      availablePorts,
      utilizationRate: (usedPorts / portCount) * 100
    };
  }
);

// Get splitter utilization by building
export const getSplitterUtilizationByBuilding = createSelector(
  [getSplittersList],
  (splitters) => {
    const buildingUtilization = {};
    
    splitters.forEach(splitter => {
      const buildingId = splitter.buildingId;
      if (!buildingId) return;
      
      // If building doesn't exist in the stats object yet, initialize it
      if (!buildingUtilization[buildingId]) {
        buildingUtilization[buildingId] = {
          totalSplitters: 0,
          totalPorts: 0,
          usedPorts: 0,
          availablePorts: 0
        };
      }
      
      // Default port count if not specified
      const portCount = splitter.portCount || 32;
      // Default port status if not specified
      const portStatus = splitter.portStatus || {};
      
      // Count used ports
      let usedPorts = 0;
      for (let i = 1; i <= portCount; i++) {
        if (portStatus[i] && portStatus[i].isUsed) {
          usedPorts++;
        }
      }
      
      // Update building utilization stats
      buildingUtilization[buildingId].totalSplitters++;
      buildingUtilization[buildingId].totalPorts += portCount;
      buildingUtilization[buildingId].usedPorts += usedPorts;
      buildingUtilization[buildingId].availablePorts += (portCount - usedPorts);
    });
    
    // Calculate utilization rates
    Object.keys(buildingUtilization).forEach(buildingId => {
      const utilization = buildingUtilization[buildingId];
      utilization.utilizationRate = utilization.totalPorts > 0 
        ? (utilization.usedPorts / utilization.totalPorts) * 100 
        : 0;
    });
    
    return buildingUtilization;
  }
);

// Get all splitter ports for a specific splitter
export const getSplitterPorts = createSelector(
  [getSplitterById],
  (splitter) => {
    if (!splitter) return [];
    
    const portCount = splitter.portCount || 32;
    const portStatus = splitter.portStatus || {};
    const ports = [];
    
    for (let i = 1; i <= portCount; i++) {
      const portInfo = portStatus[i] || {};
      ports.push({
        portNumber: i,
        isUsed: portInfo.isUsed || false,
        serviceId: portInfo.serviceId || null,
        customerName: portInfo.customerName || null,
        activationDate: portInfo.activationDate || null,
        status: portInfo.status || 'AVAILABLE'
      });
    }
    
    return ports;
  }
);

// Get available splitter ports for a specific splitter
export const getAvailableSplitterPorts = createSelector(
  [getSplitterPorts],
  (ports) => {
    return ports.filter(port => !port.isUsed);
  }
);

// Get used splitter ports for a specific splitter
export const getUsedSplitterPorts = createSelector(
  [getSplitterPorts],
  (ports) => {
    return ports.filter(port => port.isUsed);
  }
);

// Search splitters
export const searchSplitters = createSelector(
  [getSplittersList, (_, query) => query],
  (splitters, query) => {
    if (!query) return splitters;
    
    const searchTerm = query.toLowerCase();
    return splitters.filter(splitter => 
      (splitter.serviceId && splitter.serviceId.toLowerCase().includes(searchTerm)) ||
      (splitter.splitterLevel && splitter.splitterLevel.toLowerCase().includes(searchTerm)) ||
      (splitter.splitterNumber && splitter.splitterNumber.toLowerCase().includes(searchTerm)) ||
      (splitter.alias && splitter.alias.toLowerCase().includes(searchTerm))
    );
  }
);

export default {
  getSplittersState,
  getSplittersList,
  getSplittersLoading,
  getSplittersError,
  getTotalSplittersCount,
  getSplitterById,
  getSplittersByBuilding,
  getSplitterByServiceId,
  getSplitterWithBuilding,
  getSplitterStatus,
  getSplitterUtilizationByBuilding,
  getSplitterPorts,
  getAvailableSplitterPorts,
  getUsedSplitterPorts,
  searchSplitters
};