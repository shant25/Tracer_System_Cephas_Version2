/**
 * Order-related selectors for accessing the orders state
 */
import { createSelector } from 'reselect';
import { ORDER_STATUS, ORDER_TYPES } from '../../config';

// Basic selectors
export const getOrdersState = (state) => state.orders;
export const getOrdersList = (state) => state.orders.items || [];
export const getOrdersLoading = (state) => state.orders.loading;
export const getOrdersError = (state) => state.orders.error;
export const getTotalOrdersCount = (state) => state.orders.totalCount || 0;

// Get order by ID
export const getOrderById = (state, orderId) => {
  const orders = getOrdersList(state);
  return orders.find(order => order.id.toString() === orderId.toString()) || null;
};

// Get orders by status
export const getOrdersByStatus = createSelector(
  [getOrdersList, (_, status) => status],
  (orders, status) => {
    if (!status) return orders;
    if (Array.isArray(status)) {
      return orders.filter(order => status.includes(order.status));
    }
    return orders.filter(order => order.status === status);
  }
);

// Get orders by type
export const getOrdersByType = createSelector(
  [getOrdersList, (_, type) => type],
  (orders, type) => {
    if (!type) return orders;
    if (Array.isArray(type)) {
      return orders.filter(order => type.includes(order.orderType));
    }
    return orders.filter(order => order.orderType === type);
  }
);

// Get orders by building ID
export const getOrdersByBuilding = createSelector(
  [getOrdersList, (_, buildingId) => buildingId],
  (orders, buildingId) => {
    if (!buildingId) return orders;
    return orders.filter(order => order.buildingId.toString() === buildingId.toString());
  }
);

// Get orders by service installer ID
export const getOrdersByServiceInstaller = createSelector(
  [getOrdersList, (_, serviceInstallerId) => serviceInstallerId],
  (orders, serviceInstallerId) => {
    if (!serviceInstallerId) return orders;
    return orders.filter(order => 
      order.serviceInstallerId && 
      order.serviceInstallerId.toString() === serviceInstallerId.toString()
    );
  }
);

// Get orders count by status
export const getOrderStatusCounts = createSelector(
  [getOrdersList],
  (orders) => {
    const counts = {
      [ORDER_STATUS.PENDING]: 0,
      [ORDER_STATUS.ASSIGNED]: 0,
      [ORDER_STATUS.IN_PROGRESS]: 0,
      [ORDER_STATUS.COMPLETED]: 0,
      [ORDER_STATUS.CANCELLED]: 0,
      total: orders.length,
    };
    
    orders.forEach(order => {
      if (order.status && counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });
    
    return counts;
  }
);

// Get orders count by type
export const getOrderTypeCounts = createSelector(
  [getOrdersList],
  (orders) => {
    const counts = {
      [ORDER_TYPES.ACTIVATION]: 0,
      [ORDER_TYPES.MODIFICATION]: 0,
      [ORDER_TYPES.ASSURANCE]: 0,
      total: orders.length,
    };
    
    orders.forEach(order => {
      if (order.orderType && counts[order.orderType] !== undefined) {
        counts[order.orderType]++;
      }
    });
    
    return counts;
  }
);

// Get orders by date range
export const getOrdersByDateRange = createSelector(
  [getOrdersList, (_, startDate, endDate) => ({ startDate, endDate })],
  (orders, { startDate, endDate }) => {
    if (!startDate && !endDate) return orders;
    
    return orders.filter(order => {
      const orderDate = new Date(order.appointmentDate);
      
      if (startDate && endDate) {
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      } else if (startDate) {
        return orderDate >= new Date(startDate);
      } else if (endDate) {
        return orderDate <= new Date(endDate);
      }
      
      return true;
    });
  }
);

// Get orders for today
export const getTodaysOrders = createSelector(
  [getOrdersList],
  (orders) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return orders.filter(order => {
      const orderDate = new Date(order.appointmentDate);
      orderDate.setHours(0, 0, 0, 0);
      
      return orderDate.getTime() === today.getTime();
    });
  }
);

// Get orders for this week
export const getThisWeeksOrders = createSelector(
  [getOrdersList],
  (orders) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);
    
    return orders.filter(order => {
      const orderDate = new Date(order.appointmentDate);
      
      return orderDate >= startOfWeek && orderDate <= endOfWeek;
    });
  }
);

// Get unassigned orders
export const getUnassignedOrders = createSelector(
  [getOrdersList],
  (orders) => {
    return orders.filter(order => 
      !order.serviceInstallerId || 
      order.serviceInstallerId === null || 
      order.serviceInstallerId === ''
    );
  }
);

// Search orders
export const searchOrders = createSelector(
  [getOrdersList, (_, query) => query],
  (orders, query) => {
    if (!query) return orders;
    
    const searchTerm = query.toLowerCase();
    return orders.filter(order => 
      (order.customer && order.customer.toLowerCase().includes(searchTerm)) ||
      (order.customerPhone && order.customerPhone.toLowerCase().includes(searchTerm)) ||
      (order.tbbnoId && order.tbbnoId.toLowerCase().includes(searchTerm)) ||
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm))
    );
  }
);

export default {
  getOrdersState,
  getOrdersList,
  getOrdersLoading,
  getOrdersError,
  getTotalOrdersCount,
  getOrderById,
  getOrdersByStatus,
  getOrdersByType,
  getOrdersByBuilding,
  getOrdersByServiceInstaller,
  getOrderStatusCounts,
  getOrderTypeCounts,
  getOrdersByDateRange,
  getTodaysOrders,
  getThisWeeksOrders,
  getUnassignedOrders,
  searchOrders
};