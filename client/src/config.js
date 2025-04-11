/**
 * Application configuration
 * Central configuration for the Cephas Tracker application
 */

// Load environment variables
const env = process.env;

// API configuration
export const API_URL = env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication configuration
export const AUTH_TOKEN_KEY = 'cephas_auth_token';
export const AUTH_REFRESH_TOKEN_KEY = 'cephas_refresh_token';
export const AUTH_USER_KEY = 'cephas_user';
export const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

// Application theme and branding
export const APP_THEME = {
  PRIMARY_COLOR: '#10b981', // Green-500
  SECONDARY_COLOR: '#374151', // Gray-700
  DANGER_COLOR: '#ef4444', // Red-500
  WARNING_COLOR: '#f59e0b', // Amber-500
  SUCCESS_COLOR: '#10b981', // Green-500
  INFO_COLOR: '#3b82f6', // Blue-500
};

// Role configuration
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  SUPERVISOR: 'supervisor',
  INSTALLER: 'service_installer',
  ACCOUNTANT: 'accountant',
  WAREHOUSE: 'warehouse'
};

// File upload configuration
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ALL: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
};

// Date and time format configuration
export const DATE_FORMAT = 'MMMM d, yyyy';
export const TIME_FORMAT = 'h:mm a';
export const DATE_TIME_FORMAT = 'MMMM d, yyyy h:mm a';
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';
export const ISO_TIME_FORMAT = 'HH:mm:ss';
export const ISO_DATE_TIME_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss';

// Pagination configuration
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Dashboard configuration
export const DASHBOARD_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Notification configuration
export const NOTIFICATION_AUTO_DISMISS_DURATION = 5000; // 5 seconds
export const MAX_VISIBLE_NOTIFICATIONS = 5;

// Mobile breakpoints
export const MOBILE_BREAKPOINT = 640; // Small screen size

// Order status options
export const ORDER_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Order types
export const ORDER_TYPES = {
  ACTIVATION: 'activation',
  MODIFICATION: 'modification',
  ASSURANCE: 'assurance'
};

// Material status options
export const MATERIAL_STATUS = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  DEPLETED: 'depleted',
  DEFECTIVE: 'defective'
};

// Invoice status options
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

// Building types
export const BUILDING_TYPES = {
  PRELAID: 'prelaid',
  NON_PRELAID: 'non_prelaid'
};

// Feature flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_DARK_MODE: false,
  ENABLE_ANALYTICS: env.NODE_ENV === 'production',
  ENABLE_PWA: env.NODE_ENV === 'production',
  ENABLE_DEBUG: env.NODE_ENV === 'development',
};

// Application version
export const APP_VERSION = '1.0.0';

// Export all configuration as default
export default {
  API_URL,
  API_TIMEOUT,
  AUTH_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_USER_KEY,
  TOKEN_EXPIRY_BUFFER,
  APP_THEME,
  ROLES,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  DATE_FORMAT,
  TIME_FORMAT,
  DATE_TIME_FORMAT,
  ISO_DATE_FORMAT,
  ISO_TIME_FORMAT,
  ISO_DATE_TIME_FORMAT,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  DASHBOARD_REFRESH_INTERVAL,
  NOTIFICATION_AUTO_DISMISS_DURATION,
  MAX_VISIBLE_NOTIFICATIONS,
  MOBILE_BREAKPOINT,
  ORDER_STATUS,
  ORDER_TYPES,
  MATERIAL_STATUS,
  INVOICE_STATUS,
  BUILDING_TYPES,
  FEATURES,
  APP_VERSION
};