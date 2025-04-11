/**
 * Building-related selectors for accessing the buildings state
 */
import { createSelector } from 'reselect';
import { BUILDING_TYPES } from '../../config';

// Basic selectors
export const getBuildingsState = (state) => state.buildings;
export const getBuildingsList = (state) => state.buildings.items || [];
export const getBuildingsLoading = (state) => state.buildings.loading;
export const getBuildingsError = (state) => state.buildings.error;
export const getTotalBuildingsCount = (state) => state.buildings.totalCount || 0;

// Get building by ID
export const getBuildingById = (state, buildingId) => {
  const buildings = getBuildingsList(state);
  return buildings.find(building => building.id.toString() === buildingId.toString()) || null;
};

// Get buildings by type
export const getBuildingsByType = createSelector(
  [getBuildingsList, (_, type) => type],
  (buildings, type) => {
    if (!type) return buildings;
    return buildings.filter(building => building.type === type);
  }
);

// Get buildings by location
export const getBuildingsByLocation = createSelector(
  [getBuildingsList, (_, location) => location],
  (buildings, location) => {
    if (!location) return buildings;
    return buildings.filter(building => building.location === location);
  }
);

// Get all unique building locations
export const getUniqueBuildingLocations = createSelector(
  [getBuildingsList],
  (buildings) => {
    const locations = buildings.map(building => building.location);
    return [...new Set(locations)].filter(Boolean).sort();
  }
);

// Get all unique building types
export const getUniqueBuildingTypes = createSelector(
  [getBuildingsList],
  (buildings) => {
    const types = buildings.map(building => building.type);
    return [...new Set(types)].filter(Boolean).sort();
  }
);

// Get building type counts
export const getBuildingTypeCounts = createSelector(
  [getBuildingsList],
  (buildings) => {
    const counts = {
      [BUILDING_TYPES.PRELAID]: 0,
      [BUILDING_TYPES.NON_PRELAID]: 0,
      [BUILDING_TYPES.BOTH]: 0,
      total: buildings.length,
    };
    
    buildings.forEach(building => {
      if (building.type && counts[building.type] !== undefined) {
        counts[building.type]++;
      }
    });
    
    return counts;
  }
);

// Get building with splitters count
export const getBuildingsWithSplittersCount = createSelector(
  [getBuildingsList],
  (buildings) => {
    return buildings.filter(building => {
      return building.splitters && building.splitters.length > 0;
    }).length;
  }
);

// Get building with stats
export const getBuildingWithStats = createSelector(
  [getBuildingById, (state, _, splitterState) => splitterState ? state[splitterState] : null],
  (building, splitterState) => {
    if (!building) return null;
    
    // If we have splitter state, let's enhance the building with stats
    if (splitterState && splitterState.items) {
      const buildingSplitters = splitterState.items.filter(
        splitter => splitter.buildingId.toString() === building.id.toString()
      );
      
      const totalPorts = buildingSplitters.reduce((total, splitter) => total + (splitter.portCount || 0), 0);
      const usedPorts = buildingSplitters.reduce((total, splitter) => total + (splitter.usedPorts || 0), 0);
      
      return {
        ...building,
        splitters: buildingSplitters,
        totalPorts,
        usedPorts,
        availablePorts: totalPorts - usedPorts,
        utilizationRate: totalPorts > 0 ? (usedPorts / totalPorts) * 100 : 0
      };
    }
    
    return building;
  }
);

// Get buildings list for dropdown
export const getBuildingsForDropdown = createSelector(
  [getBuildingsList],
  (buildings) => {
    return buildings.map(building => ({
      value: building.id.toString(),
      label: building.name
    }));
  }
);

// Search buildings
export const searchBuildings = createSelector(
  [getBuildingsList, (_, query) => query],
  (buildings, query) => {
    if (!query) return buildings;
    
    const searchTerm = query.toLowerCase();
    return buildings.filter(building => 
      (building.name && building.name.toLowerCase().includes(searchTerm)) ||
      (building.location && building.location.toLowerCase().includes(searchTerm)) ||
      (building.address && building.address.toLowerCase().includes(searchTerm)) ||
      (building.contactPerson && building.contactPerson.toLowerCase().includes(searchTerm))
    );
  }
);

export default {
  getBuildingsState,
  getBuildingsList,
  getBuildingsLoading,
  getBuildingsError,
  getTotalBuildingsCount,
  getBuildingById,
  getBuildingsByType,
  getBuildingsByLocation,
  getUniqueBuildingLocations,
  getUniqueBuildingTypes,
  getBuildingTypeCounts,
  getBuildingsWithSplittersCount,
  getBuildingWithStats,
  getBuildingsForDropdown,
  searchBuildings
};