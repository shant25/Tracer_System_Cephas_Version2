import { 
  AUTH_TOKEN_KEY, 
  AUTH_REFRESH_TOKEN_KEY, 
  AUTH_USER_KEY
} from '../config';
import api from './api';

/**
 * Authentication service for handling user authentication
 */
const AuthService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to remember user login
   * @returns {Promise} Login result
   */
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.success && response.data.token) {
        // Store token and user data in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        
        // Store refresh token if available
        if (response.data.refreshToken) {
          localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, response.data.refreshToken);
        }
        
        // Store user data
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.user));
        
        // Set auth token in api service
        api.setAuthToken(response.data.token);
        
        return {
          success: true,
          user: response.data.user
        };
      }
      
      return {
        success: false,
        message: response.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Authentication failed'
      };
    }
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration result
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      return {
        success: true,
        message: response.message || 'Registration successful',
        user: response.data.user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  },
  
  /**
   * Logout user
   * @param {boolean} redirectToLogin - Whether to redirect to login page
   */
  logout: (redirectToLogin = true) => {
    // Remove tokens and user data from localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    
    // Remove auth token from api service
    api.setAuthToken(null);
    
    // Redirect to login page if specified
    if (redirectToLogin) {
      window.location.href = '/login';
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} Whether user is authenticated
   */
  isAuthenticated: () => {
    return api.isAuthenticated();
  },
  
  /**
   * Get current user data
   * @returns {Object|null} User data or null if not authenticated
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    
    if (!userStr) {
      return null;
    }
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  /**
   * Get user role
   * @returns {string|null} User role or null if not authenticated
   */
  getUserRole: () => {
    const user = AuthService.getCurrentUser();
    return user ? user.role : null;
  },
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Password reset request result
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      return {
        success: true,
        message: response.message || 'Password reset email sent'
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: error.message || 'Failed to request password reset'
      };
    }
  },
  
  /**
   * Reset password with token
   * @param {string} token - Password reset token
   * @param {string} password - New password
   * @returns {Promise} Password reset result
   */
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      
      return {
        success: true,
        message: response.message || 'Password reset successful'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: error.message || 'Failed to reset password'
      };
    }
  }
};

export default AuthService;