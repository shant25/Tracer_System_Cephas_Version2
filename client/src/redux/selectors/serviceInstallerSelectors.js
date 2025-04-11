/**
 * Service Installer-related selectors for accessing the service installers state
 */
import { createSelector } from 'reselect';
import { getOrdersList } from './orderSelectors';

// Basic selectors
export const getServiceInstallersState = (state) => state.serviceInstallers;
export const getServiceInstallersList = (state) => state.serviceInstallers.items || [];
export const getServiceInstallersLoading = (state) => state.serviceInstallers.loading;
export const getServiceInstallersError = (state) => state.serviceInstallers.error;
export const getTotalServiceInstallersCount = (state) => state.serviceInstallers.totalCount || 0;

// Get service installer by ID
export const getServiceInstallerById = (state, installerId) => {
  const serviceInstallers = getServiceInstallersList(state);
  return serviceInstallers.find(installer => installer.id.toString() === installerId.toString()) || null;
};

// Get active service installers
export const getActiveServiceInstallers = createSelector(
  [getServiceInstallersList],
  (serviceInstallers) => {
    return serviceInstallers.filter(installer => installer.isActive !== false);
  }
);

// Get inactive service installers
export const getInactiveServiceInstallers = createSelector(
  [getServiceInstallersList],
  (serviceInstallers) => {
    return serviceInstallers.filter(installer => installer.isActive === false);
  }
);

// Get service installers with assignment counts
export const getServiceInstallersWithStats = createSelector(
  [getServiceInstallersList, getOrdersList],
  (serviceInstallers, orders) => {
    return serviceInstallers.map(installer => {
      const assignedOrders = orders.filter(order => 
        order.serviceInstallerId && 
        order.serviceInstallerId.toString() === installer.id.toString()
      );
      
      const completedOrders = assignedOrders.filter(order => order.status === 'COMPLETED');
      const inProgressOrders = assignedOrders.filter(order => order.status === 'IN_PROGRESS');
      const pendingOrders = assignedOrders.filter(order => 
        order.status !== 'COMPLETED' && order.status !== 'IN_PROGRESS'
      );
      
      return {
        ...installer,
        orderStats: {
          totalAssigned: assignedOrders.length,
          completed: completedOrders.length,
          inProgress: inProgressOrders.length,
          pending: pendingOrders.length
        }
      };
    });
  }
);

// Get service installer availability based on assignments
export const getServiceInstallerAvailability = createSelector(
  [getServiceInstallersList, getOrdersList],
  (serviceInstallers, orders) => {
    const availability = {};
    
    serviceInstallers.forEach(installer => {
      if (installer.isActive === false) {
        availability[installer.id] = {
          available: false,
          reason: 'Inactive',
          activeAssignments: 0
        };
        return;
      }
      
      const activeAssignments = orders.filter(order => 
        order.serviceInstallerId && 
        order.serviceInstallerId.toString() === installer.id.toString() &&
        order.status !== 'COMPLETED' &&
        order.status !== 'CANCELLED'
      ).length;
      
      // You can adjust the threshold based on your business rules
      const maxActiveAssignments = installer.maxAssignments || 5;
      
      availability[installer.id] = {
        available: activeAssignments < maxActiveAssignments,
        reason: activeAssignments >= maxActiveAssignments ? 'Max assignments reached' : null,
        activeAssignments
      };
    });
    
    return availability;
  }
);

// Get service installer performance metrics
export const getServiceInstallerPerformance = createSelector(
  [getServiceInstallersList, getOrdersList],
  (serviceInstallers, orders) => {
    const performance = {};
    
    serviceInstallers.forEach(installer => {
      const assignedOrders = orders.filter(order => 
        order.serviceInstallerId && 
        order.serviceInstallerId.toString() === installer.id.toString()
      );
      
      const completedOrders = assignedOrders.filter(order => order.status === 'COMPLETED');
      const cancelledOrders = assignedOrders.filter(order => order.status === 'CANCELLED');
      
      let avgCompletionTime = 0;
      let onTimeCompletions = 0;
      
      completedOrders.forEach(order => {
        if (order.completedDate && order.assignedDate) {
          const assignedTime = new Date(order.assignedDate).getTime();
          const completedTime = new Date(order.completedDate).getTime();
          const timeDiff = completedTime - assignedTime;
          
          // Add to average calculation (in hours)
          avgCompletionTime += timeDiff / (1000 * 60 * 60);
          
          // Check if completed on scheduled date
          const appointmentDate = new Date(order.appointmentDate).setHours(0, 0, 0, 0);
          const completedDate = new Date(order.completedDate).setHours(0, 0, 0, 0);
          
          if (completedDate <= appointmentDate) {
            onTimeCompletions++;
          }
        }
      });
      
      if (completedOrders.length > 0) {
        avgCompletionTime = avgCompletionTime / completedOrders.length;
      }
      
      performance[installer.id] = {
        totalAssigned: assignedOrders.length,
        completed: completedOrders.length,
        cancelled: cancelledOrders.length,
        completionRate: assignedOrders.length ? (completedOrders.length / assignedOrders.length) * 100 : 0,
        avgCompletionTime: avgCompletionTime,
        onTimeCompletionRate: completedOrders.length ? (onTimeCompletions / completedOrders.length) * 100 : 0
      };
    });
    
    return performance;
  }
);

// Get service installers for dropdown
export const getServiceInstallersForDropdown = createSelector(
  [getActiveServiceInstallers],
  (serviceInstallers) => {
    return serviceInstallers.map(installer => ({
      value: installer.id.toString(),
      label: installer.name
    }));
  }
);

// Get service installers by workload
export const getServiceInstallersByWorkload = createSelector(
  [getServiceInstallersWithStats],
  (serviceInstallers) => {
    return [...serviceInstallers].sort((a, b) => {
      return a.orderStats.inProgress - b.orderStats.inProgress;
    });
  }
);

// Search service installers
export const searchServiceInstallers = createSelector(
  [getServiceInstallersList, (_, query) => query],
  (serviceInstallers, query) => {
    if (!query) return serviceInstallers;
    
    const searchTerm = query.toLowerCase();
    return serviceInstallers.filter(installer => 
      (installer.name && installer.name.toLowerCase().includes(searchTerm)) ||
      (installer.contactNo && installer.contactNo.toLowerCase().includes(searchTerm)) ||
      (installer.email && installer.email.toLowerCase().includes(searchTerm))
    );
  }
);

export default {
  getServiceInstallersState,
  getServiceInstallersList,
  getServiceInstallersLoading,
  getServiceInstallersError,
  getTotalServiceInstallersCount,
  getServiceInstallerById,
  getActiveServiceInstallers,
  getInactiveServiceInstallers,
  getServiceInstallersWithStats,
  getServiceInstallerAvailability,
  getServiceInstallerPerformance,
  getServiceInstallersForDropdown,
  getServiceInstallersByWorkload,
  searchServiceInstallers
};