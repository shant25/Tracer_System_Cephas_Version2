/**
 * UI-related selectors for accessing the UI state
 */
import { createSelector } from 'reselect';

// Basic selectors
export const getUIState = (state) => state.ui;
export const getIsLoading = (state) => state.ui.loading || false;
export const getLoadingText = (state) => state.ui.loadingText || 'Loading...';
export const getErrorState = (state) => state.ui.error;
export const getErrorMessage = (state) => state.ui.error?.message || '';
export const getTheme = (state) => state.ui.theme || 'light';
export const getSidebarState = (state) => state.ui.sidebar?.open || false;
export const getSidebarWidth = (state) => state.ui.sidebar?.width || 256;
export const getModalState = (state) => state.ui.modals || {};
export const getNotifications = (state) => state.ui.notifications || [];
export const isNetworkActive = (state) => state.ui.networkActive || true;
export const getFilters = (state) => state.ui.filters || {};
export const getSort = (state) => state.ui.sort || {};
export const getPagination = (state) => state.ui.pagination || { page: 1, limit: 10 };

// Get if a specific modal is open
export const isModalOpen = createSelector(
  [getModalState, (_, modalName) => modalName],
  (modals, modalName) => {
    return modals[modalName]?.open || false;
  }
);

// Get modal data for a specific modal
export const getModalData = createSelector(
  [getModalState, (_, modalName) => modalName],
  (modals, modalName) => {
    return modals[modalName]?.data || null;
  }
);

// Get loading state for a specific entity
export const isEntityLoading = createSelector(
  [getUIState, (_, entity) => entity],
  (uiState, entity) => {
    if (!entity) return uiState.loading;
    return uiState.entityLoading?.[entity] || false;
  }
);

// Get unread notifications count
export const getUnreadNotificationsCount = createSelector(
  [getNotifications],
  (notifications) => {
    return notifications.filter(notification => !notification.read).length;
  }
);

// Get recent notifications
export const getRecentNotifications = createSelector(
  [getNotifications],
  (notifications) => {
    return [...notifications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }
);

// Get notification by ID
export const getNotificationById = createSelector(
  [getNotifications, (_, notificationId) => notificationId],
  (notifications, notificationId) => {
    return notifications.find(notification => notification.id.toString() === notificationId.toString()) || null;
  }
);

// Get active filters
export const getActiveFilters = createSelector(
  [getFilters],
  (filters) => {
    const activeFilters = {};
    
    // Iterate through all filters and only include those with values
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        activeFilters[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        const nonEmptyNestedFilters = {};
        let hasValues = false;
        
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue !== null && nestedValue !== undefined && nestedValue !== '') {
            nonEmptyNestedFilters[nestedKey] = nestedValue;
            hasValues = true;
          }
        });
        
        if (hasValues) {
          activeFilters[key] = nonEmptyNestedFilters;
        }
      } else if (value !== null && value !== undefined && value !== '') {
        activeFilters[key] = value;
      }
    });
    
    return activeFilters;
  }
);

// Get specific filter
export const getFilter = createSelector(
  [getFilters, (_, filterName) => filterName],
  (filters, filterName) => {
    return filters[filterName];
  }
);

// Get sort order for a specific entity
export const getSortForEntity = createSelector(
  [getSort, (_, entity) => entity],
  (sort, entity) => {
    return sort[entity] || { field: 'createdAt', direction: 'desc' };
  }
);

// Get pagination for a specific entity
export const getPaginationForEntity = createSelector(
  [getPagination, (_, entity) => entity],
  (pagination, entity) => {
    return pagination[entity] || { page: 1, limit: 10, total: 0 };
  }
);

// Get breadcrumbs
export const getBreadcrumbs = (state) => state.ui.breadcrumbs || [];

// Get last viewed items
export const getLastViewedItems = (state) => state.ui.lastViewed || [];

// Get UI settings
export const getUISettings = createSelector(
  [getUIState],
  (uiState) => {
    return {
      theme: uiState.theme || 'light',
      sidebarCollapsed: !uiState.sidebar?.open,
      compactMode: uiState.compactMode || false,
      tableViewMode: uiState.tableViewMode || 'list',
      dateFormat: uiState.dateFormat || 'MMMM d, yyyy',
      timeFormat: uiState.timeFormat || 'h:mm a',
      notificationsEnabled: uiState.notificationsEnabled !== false,
      autoRefreshEnabled: uiState.autoRefreshEnabled || false,
      autoRefreshInterval: uiState.autoRefreshInterval || 60000
    };
  }
);

// Get search state
export const getSearchState = createSelector(
  [getUIState],
  (uiState) => {
    return {
      query: uiState.search?.query || '',
      results: uiState.search?.results || [],
      isSearching: uiState.search?.loading || false,
      hasSearched: uiState.search?.hasSearched || false,
      totalResults: uiState.search?.totalResults || 0
    };
  }
);

export default {
  getUIState,
  getIsLoading,
  getLoadingText,
  getErrorState,
  getErrorMessage,
  getTheme,
  getSidebarState,
  getSidebarWidth,
  getModalState,
  getNotifications,
  isNetworkActive,
  getFilters,
  getSort,
  getPagination,
  isModalOpen,
  getModalData,
  isEntityLoading,
  getUnreadNotificationsCount,
  getRecentNotifications,
  getNotificationById,
  getActiveFilters,
  getFilter,
  getSortForEntity,
  getPaginationForEntity,
  getBreadcrumbs,
  getLastViewedItems,
  getUISettings,
  getSearchState
};