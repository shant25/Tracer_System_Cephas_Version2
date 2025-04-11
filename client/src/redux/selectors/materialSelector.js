/**
 * Material-related selectors for accessing the materials state
 */
import { createSelector } from 'reselect';
import { MATERIAL_STATUS } from '../../config';

// Basic selectors
export const getMaterialsState = (state) => state.materials;
export const getMaterialsList = (state) => state.materials.items || [];
export const getMaterialsLoading = (state) => state.materials.loading;
export const getMaterialsError = (state) => state.materials.error;
export const getTotalMaterialsCount = (state) => state.materials.totalCount || 0;

// Get material by ID
export const getMaterialById = (state, materialId) => {
  const materials = getMaterialsList(state);
  return materials.find(material => material.id.toString() === materialId.toString()) || null;
};

// Get material by SAP code
export const getMaterialBySapCode = (state, sapCode) => {
  const materials = getMaterialsList(state);
  return materials.find(material => material.sapCode === sapCode) || null;
};

// Get materials by type
export const getMaterialsByType = createSelector(
  [getMaterialsList, (_, type) => type],
  (materials, type) => {
    if (!type) return materials;
    if (Array.isArray(type)) {
      return materials.filter(material => type.includes(material.materialType));
    }
    return materials.filter(material => material.materialType === type);
  }
);

// Get materials by status
export const getMaterialsByStatus = createSelector(
  [getMaterialsList],
  (materials) => {
    const result = {
      [MATERIAL_STATUS.AVAILABLE]: [],
      [MATERIAL_STATUS.DEPLETED]: [],
      [MATERIAL_STATUS.LOW_STOCK]: [],
      all: materials
    };
    
    materials.forEach(material => {
      const stock = material.stockKeepingUnit || 0;
      const minStock = material.minimumStock || 0;
      
      if (stock <= 0) {
        result[MATERIAL_STATUS.DEPLETED].push(material);
      } else if (stock < minStock) {
        result[MATERIAL_STATUS.LOW_STOCK].push(material);
      } else {
        result[MATERIAL_STATUS.AVAILABLE].push(material);
      }
    });
    
    return result;
  }
);

// Get active materials
export const getActiveMaterials = createSelector(
  [getMaterialsList],
  (materials) => {
    return materials.filter(material => material.isActive !== false);
  }
);

// Get inactive materials
export const getInactiveMaterials = createSelector(
  [getMaterialsList],
  (materials) => {
    return materials.filter(material => material.isActive === false);
  }
);

// Get low stock materials
export const getLowStockMaterials = createSelector(
  [getMaterialsList],
  (materials) => {
    return materials.filter(material => {
      const stock = material.stockKeepingUnit || 0;
      const minStock = material.minimumStock || 0;
      return stock > 0 && stock < minStock;
    });
  }
);

// Get out of stock materials
export const getOutOfStockMaterials = createSelector(
  [getMaterialsList],
  (materials) => {
    return materials.filter(material => {
      const stock = material.stockKeepingUnit || 0;
      return stock <= 0;
    });
  }
);

// Get material stock status counts
export const getMaterialStockStatusCounts = createSelector(
  [getMaterialsList],
  (materials) => {
    const counts = {
      total: materials.length,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0
    };
    
    materials.forEach(material => {
      const stock = material.stockKeepingUnit || 0;
      const minStock = material.minimumStock || 0;
      
      if (stock <= 0) {
        counts.outOfStock++;
      } else if (stock < minStock) {
        counts.lowStock++;
      } else {
        counts.inStock++;
      }
    });
    
    return counts;
  }
);

// Get material type counts
export const getMaterialTypeCounts = createSelector(
  [getMaterialsList],
  (materials) => {
    const counts = {};
    
    materials.forEach(material => {
      const type = material.materialType || 'OTHER';
      counts[type] = (counts[type] || 0) + 1;
    });
    
    return counts;
  }
);

// Get materials for dropdown
export const getMaterialsForDropdown = createSelector(
  [getActiveMaterials],
  (materials) => {
    return materials.map(material => ({
      value: material.id.toString(),
      label: `${material.description} (${material.sapCode})`,
      sapCode: material.sapCode,
      description: material.description,
      stockKeepingUnit: material.stockKeepingUnit,
      unitPrice: material.unitPrice
    }));
  }
);

// Search materials
export const searchMaterials = createSelector(
  [getMaterialsList, (_, query) => query],
  (materials, query) => {
    if (!query) return materials;
    
    const searchTerm = query.toLowerCase();
    return materials.filter(material => 
      (material.description && material.description.toLowerCase().includes(searchTerm)) ||
      (material.sapCode && material.sapCode.toLowerCase().includes(searchTerm)) ||
      (material.materialType && material.materialType.toLowerCase().includes(searchTerm)) ||
      (material.notes && material.notes.toLowerCase().includes(searchTerm))
    );
  }
);

// Filter materials by multiple criteria
export const filterMaterials = createSelector(
  [
    getMaterialsList,
    (_, filters) => filters || {}
  ],
  (materials, filters) => {
    return materials.filter(material => {
      // Filter by type
      if (filters.type && material.materialType !== filters.type) {
        return false;
      }
      
      // Filter by stock status
      if (filters.stockStatus) {
        const stock = material.stockKeepingUnit || 0;
        const minStock = material.minimumStock || 0;
        
        if (filters.stockStatus === 'in_stock' && (stock <= 0 || stock < minStock)) {
          return false;
        }
        
        if (filters.stockStatus === 'low_stock' && (stock <= 0 || stock >= minStock)) {
          return false;
        }
        
        if (filters.stockStatus === 'out_of_stock' && stock > 0) {
          return false;
        }
      }
      
      // Filter by active status
      if (filters.isActive !== undefined && material.isActive !== filters.isActive) {
        return false;
      }
      
      // Filter by price range
      if (filters.minPrice !== undefined && 
          (material.unitPrice === undefined || material.unitPrice < filters.minPrice)) {
        return false;
      }
      
      if (filters.maxPrice !== undefined && 
          (material.unitPrice === undefined || material.unitPrice > filters.maxPrice)) {
        return false;
      }
      
      return true;
    });
  }
);

export default {
  getMaterialsState,
  getMaterialsList,
  getMaterialsLoading,
  getMaterialsError,
  getTotalMaterialsCount,
  getMaterialById,
  getMaterialBySapCode,
  getMaterialsByType,
  getMaterialsByStatus,
  getActiveMaterials,
  getInactiveMaterials,
  getLowStockMaterials,
  getOutOfStockMaterials,
  getMaterialStockStatusCounts,
  getMaterialTypeCounts,
  getMaterialsForDropdown,
  searchMaterials,
  filterMaterials
};