/**
 * User-related selectors for accessing the users state
 */
import { createSelector } from 'reselect';

// Basic selectors
export const getUsersState = (state) => state.users;
export const getUsersList = (state) => state.users.items || [];
export const getUsersLoading = (state) => state.users.loading;
export const getUsersError = (state) => state.users.error;
export const getTotalUsersCount = (state) => state.users.totalCount || 0;

// Get user by ID
export const getUserById = (state, userId) => {
  const users = getUsersList(state);
  return users.find(user => user.id.toString() === userId.toString()) || null;
};

// Get users by role
export const getUsersByRole = createSelector(
  [getUsersList, (_, role) => role],
  (users, role) => {
    if (!role) return users;
    if (Array.isArray(role)) {
      return users.filter(user => role.includes(user.role));
    }
    return users.filter(user => user.role === role);
  }
);

// Get active users
export const getActiveUsers = createSelector(
  [getUsersList],
  (users) => {
    return users.filter(user => user.isActive === true);
  }
);

// Get inactive users
export const getInactiveUsers = createSelector(
  [getUsersList],
  (users) => {
    return users.filter(user => user.isActive === false);
  }
);

// Get user permissions
export const getUserPermissions = createSelector(
  [getUserById],
  (user) => {
    if (!user) return [];
    
    // If permissions are directly stored on the user object
    if (user.permissions) return user.permissions;
    
    // If permissions are derived from roles
    const rolePermissions = {
      'super_admin': ['all', 'create_user', 'edit_user', 'delete_user', 'create_building', 'edit_building', 'delete_building'],
      'supervisor': ['edit_building', 'create_activation', 'edit_activation', 'assign_job'],
      'installer': ['complete_job', 'update_stock'],
      'accountant': ['create_invoice', 'edit_invoice', 'export_data'],
      'warehouse': ['update_stock', 'create_material', 'edit_material']
    };
    
    return rolePermissions[user.role] || [];
  }
);

// Get users with full details (including permissions)
export const getUsersWithDetails = createSelector(
  [getUsersList],
  (users) => {
    return users.map(user => {
      // Calculate additional user properties
      let lastActivity = user.lastActivityAt ? new Date(user.lastActivityAt) : null;
      let daysInactive = lastActivity ? Math.floor((new Date() - lastActivity) / (1000 * 60 * 60 * 24)) : null;
      
      return {
        ...user,
        daysInactive,
        isInactiveTooLong: daysInactive > 30,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        permissions: getUserPermissions({ users: { items: [user] } }, user.id)
      };
    });
  }
);

// Check if user has a specific permission
export const hasPermission = createSelector(
  [getUserPermissions, (_, permission) => permission],
  (permissions, permission) => {
    return permissions.includes('all') || permissions.includes(permission);
  }
);

// Get user statistics
export const getUsersStats = createSelector(
  [getUsersList],
  (users) => {
    return {
      total: users.length,
      active: users.filter(user => user.isActive === true).length,
      inactive: users.filter(user => user.isActive === false).length,
      byRole: {
        superAdmin: users.filter(user => user.role === 'super_admin').length,
        supervisor: users.filter(user => user.role === 'supervisor').length,
        installer: users.filter(user => user.role === 'installer').length,
        accountant: users.filter(user => user.role === 'accountant').length,
        warehouse: users.filter(user => user.role === 'warehouse').length
      },
      recentlyActive: users.filter(user => {
        const lastActivity = user.lastActivityAt ? new Date(user.lastActivityAt) : null;
        if (!lastActivity) return false;
        const daysDiff = Math.floor((new Date() - lastActivity) / (1000 * 60 * 60 * 24));
        return daysDiff < 7;
      }).length
    };
  }
);

// Search users
export const searchUsers = createSelector(
  [getUsersList, (_, searchTerm) => searchTerm],
  (users, searchTerm) => {
    if (!searchTerm) return users;
    
    const search = searchTerm.toLowerCase();
    return users.filter(user => 
      (user.firstName && user.firstName.toLowerCase().includes(search)) ||
      (user.lastName && user.lastName.toLowerCase().includes(search)) ||
      (user.email && user.email.toLowerCase().includes(search)) ||
      (user.username && user.username.toLowerCase().includes(search))
    );
  }
);

export default {
  getUsersState,
  getUsersList,
  getUsersLoading,
  getUsersError,
  getTotalUsersCount,
  getUserById,
  getUsersByRole,
  getActiveUsers,
  getInactiveUsers,
  getUserPermissions,
  getUsersWithDetails,
  hasPermission,
  getUsersStats,
  searchUsers
};