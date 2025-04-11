/**
 * Auth-related selectors for accessing the auth state
 */

// Basic selectors
export const getAuthState = (state) => state.auth;
export const getCurrentUser = (state) => state.auth.user;
export const getAuthToken = (state) => state.auth.token;
export const isAuthLoading = (state) => state.auth.loading;
export const getAuthError = (state) => state.auth.error;

// Derived selectors
export const isAuthenticated = (state) => {
  const token = getAuthToken(state);
  return !!token;
};

export const getUserRole = (state) => {
  const user = getCurrentUser(state);
  return user ? user.role : null;
};

export const getUserPermissions = (state) => {
  const user = getCurrentUser(state);
  return user ? user.permissions : [];
};

export const getUserFullName = (state) => {
  const user = getCurrentUser(state);
  if (!user) return '';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
};

export const getUserInitials = (state) => {
  const user = getCurrentUser(state);
  if (!user) return '';
  
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Check if user has a specific permission
export const hasPermission = (state, permission) => {
  const permissions = getUserPermissions(state);
  return permissions.includes(permission);
};

// Check if user has a specific role
export const hasRole = (state, role) => {
  const userRole = getUserRole(state);
  if (Array.isArray(role)) {
    return role.includes(userRole);
  }
  return userRole === role;
};

// Get last login time
export const getLastLoginTime = (state) => {
  const user = getCurrentUser(state);
  return user ? user.lastLogin : null;
};

export default {
  getAuthState,
  getCurrentUser,
  getAuthToken,
  isAuthLoading,
  getAuthError,
  isAuthenticated,
  getUserRole,
  getUserPermissions,
  getUserFullName,
  getUserInitials,
  hasPermission,
  hasRole,
  getLastLoginTime
};