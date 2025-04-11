/**
 * Access control utility functions for the Cephas Tracker application
 * Manages user roles, permissions, and access control
 */
import { ROLES } from '../config';

// Role hierarchy (higher roles have more permissions)
const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 50,
  [ROLES.SUPERVISOR]: 40,
  [ROLES.ACCOUNTANT]: 30,
  [ROLES.WAREHOUSE]: 20,
  [ROLES.INSTALLER]: 10
};

// Module access permissions
const MODULE_PERMISSIONS = {
  'dashboard': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.ACCOUNTANT, ROLES.WAREHOUSE, ROLES.INSTALLER],
  'building': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'splitter': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'material': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.WAREHOUSE, ROLES.INSTALLER],
  'serviceInstaller': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'order': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.INSTALLER],
  'invoice': [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT, ROLES.INSTALLER],
  'report': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.ACCOUNTANT],
  'import': [ROLES.SUPER_ADMIN],
  'export': [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT],
  'search': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.ACCOUNTANT, ROLES.WAREHOUSE, ROLES.INSTALLER],
  'settings': [ROLES.SUPER_ADMIN]
};

// Action permissions
const ACTION_PERMISSIONS = {
  // Create permissions
  'create_building': [ROLES.SUPER_ADMIN],
  'create_splitter': [ROLES.SUPER_ADMIN],
  'create_material': [ROLES.SUPER_ADMIN, ROLES.WAREHOUSE],
  'create_serviceInstaller': [ROLES.SUPER_ADMIN],
  'create_order': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'create_invoice': [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT],
  'create_activation': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'create_assurance': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'create_user': [ROLES.SUPER_ADMIN],
  
  // Read permissions
  'view_building': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'view_splitter': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'view_material': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.WAREHOUSE, ROLES.INSTALLER],
  'view_serviceInstaller': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'view_order': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.INSTALLER],
  'view_invoice': [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT, ROLES.INSTALLER],
  'view_report': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.ACCOUNTANT],
  'view_activation': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.INSTALLER],
  'view_assurance': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.INSTALLER],
  'view_user': [ROLES.SUPER_ADMIN],
  
  // Update permissions
  'edit_building': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'edit_splitter': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'edit_material': [ROLES.SUPER_ADMIN, ROLES.WAREHOUSE],
  'edit_serviceInstaller': [ROLES.SUPER_ADMIN],
  'edit_order': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'edit_invoice': [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT],
  'edit_activation': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'edit_assurance': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'edit_user': [ROLES.SUPER_ADMIN],
  
  // Delete permissions
  'delete_building': [ROLES.SUPER_ADMIN],
  'delete_splitter': [ROLES.SUPER_ADMIN],
  'delete_material': [ROLES.SUPER_ADMIN],
  'delete_serviceInstaller': [ROLES.SUPER_ADMIN],
  'delete_order': [ROLES.SUPER_ADMIN],
  'delete_invoice': [ROLES.SUPER_ADMIN],
  'delete_activation': [ROLES.SUPER_ADMIN],
  'delete_assurance': [ROLES.SUPER_ADMIN],
  'delete_user': [ROLES.SUPER_ADMIN],
  
  // Special permissions
  'assign_material': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.WAREHOUSE],
  'assign_job': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'complete_job': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.INSTALLER],
  'approve_report': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR],
  'generate_report': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.ACCOUNTANT],
  'import_data': [ROLES.SUPER_ADMIN],
  'export_data': [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT],
  'change_status': [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.INSTALLER],
  'update_stock': [ROLES.SUPER_ADMIN, ROLES.WAREHOUSE],
  'system_settings': [ROLES.SUPER_ADMIN],
  'manage_users': [ROLES.SUPER_ADMIN]
};

/**
 * Check if a user has access to a specific module
 * @param {string} userRole - The user's role
 * @param {string} module - The module to check access for
 * @returns {boolean} - Whether the user has access
 */
export const hasModuleAccess = (userRole, module) => {
  if (!userRole || !module) return false;
  return MODULE_PERMISSIONS[module]?.includes(userRole) || false;
};

/**
 * Check if a user has permission to perform an action
 * @param {string} userRole - The user's role
 * @param {string} action - The action to check permission for
 * @returns {boolean} - Whether the user has permission
 */
export const hasActionPermission = (userRole, action) => {
  if (!userRole || !action) return false;
  return ACTION_PERMISSIONS[action]?.includes(userRole) || false;
};

/**
 * Check if user is authorized based on list of allowed roles
 * @param {string} userRole - The user's role
 * @param {string[]} allowedRoles - Array of roles that are allowed
 * @returns {boolean} - Whether the user is authorized
 */
export const isUserAuthorized = (userRole, allowedRoles) => {
  if (!userRole || !allowedRoles || !Array.isArray(allowedRoles)) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Check if a user role has at least the specified level in the hierarchy
 * @param {string} userRole - The user's role
 * @param {string} requiredRole - The minimum required role
 * @returns {boolean} - Whether the user has sufficient role level
 */
export const hasMinimumRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
};

/**
 * Get all permissions a user has based on their role
 * @param {string} userRole - The user's role
 * @returns {string[]} - Array of permitted actions
 */
export const getUserPermissions = (userRole) => {
  if (!userRole) return [];
  
  return Object.entries(ACTION_PERMISSIONS)
    .filter(([action, roles]) => roles.includes(userRole))
    .map(([action]) => action);
};

/**
 * Get all modules a user has access to
 * @param {string} userRole - The user's role
 * @returns {string[]} - Array of accessible modules
 */
export const getUserModules = (userRole) => {
  if (!userRole) return [];
  
  return Object.entries(MODULE_PERMISSIONS)
    .filter(([module, roles]) => roles.includes(userRole))
    .map(([module]) => module);
};

/**
 * Get readable name for a role
 * @param {string} role - The role identifier
 * @returns {string} - Human-readable role name
 */
export const getRoleName = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return 'Super Admin';
    case ROLES.SUPERVISOR:
      return 'Supervisor';
    case ROLES.ACCOUNTANT:
      return 'Accountant';
    case ROLES.WAREHOUSE:
      return 'Warehouse Manager';
    case ROLES.INSTALLER:
      return 'Service Installer';
    default:
      return role || 'Unknown Role';
  }
};

export default {
  hasModuleAccess,
  hasActionPermission,
  isUserAuthorized,
  hasMinimumRole,
  getUserPermissions,
  getUserModules,
  getRoleName
};