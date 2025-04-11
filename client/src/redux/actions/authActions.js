// client/src/redux/actions/authActions.js
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAILURE,
  PASSWORD_FORGOT_REQUEST,
  PASSWORD_FORGOT_SUCCESS,
  PASSWORD_FORGOT_FAILURE
} from './types';
import authService from '../../services/auth.service';
import { setAlert } from './uiActions';

/**
 * Load user data from token
 */
export const loadUser = () => async (dispatch) => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('cephas_auth_token');
  
  if (!token) {
    dispatch({ type: AUTH_ERROR });
    return;
  }
  
  try {
    const user = authService.getCurrentUser();
    
    if (!user) {
      dispatch({ type: AUTH_ERROR });
      return;
    }
    
    dispatch({
      type: USER_LOADED,
      payload: user
    });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Whether to remember user
 */
export const login = (email, password, rememberMe = false) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  
  try {
    const response = await authService.login(email, password, rememberMe);
    
    if (response.success) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: response.token || authService.getAuthToken(),
          user: response.user
        }
      });
      
      dispatch(setAlert('Login successful', 'success'));
      return { success: true };
    } else {
      dispatch({
        type: LOGIN_FAILURE,
        payload: response.message || 'Login failed'
      });
      
      dispatch(setAlert(response.message || 'Login failed', 'error'));
      return { success: false, message: response.message };
    }
  } catch (error) {
    const errorMsg = error.message || 'Login failed';
    
    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMsg
    });
    
    dispatch(setAlert(errorMsg, 'error'));
    return { success: false, message: errorMsg };
  }
};

/**
 * Logout user
 */
export const logout = () => (dispatch) => {
  try {
    authService.logout(false); // Don't redirect
    
    dispatch({ type: LOGOUT });
    dispatch(setAlert('Logged out successfully', 'success'));
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Request password reset (forgot password)
 * @param {string} email - User email
 */
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: PASSWORD_FORGOT_REQUEST });
  
  try {
    const response = await authService.requestPasswordReset(email);
    
    if (response.success) {
      dispatch({
        type: PASSWORD_FORGOT_SUCCESS
      });
      
      dispatch(setAlert('Password reset link has been sent to your email', 'success'));
      return { success: true };
    } else {
      dispatch({
        type: PASSWORD_FORGOT_FAILURE,
        payload: response.message || 'Failed to send password reset link'
      });
      
      dispatch(setAlert(response.message || 'Failed to send password reset link', 'error'));
      return { success: false, message: response.message };
    }
  } catch (error) {
    const errorMsg = error.message || 'Failed to send password reset link';
    
    dispatch({
      type: PASSWORD_FORGOT_FAILURE,
      payload: errorMsg
    });
    
    dispatch(setAlert(errorMsg, 'error'));
    return { success: false, message: errorMsg };
  }
};

/**
 * Reset password
 * @param {string} token - Reset token
 * @param {string} password - New password
 */
export const resetPassword = (token, password) => async (dispatch) => {
  dispatch({ type: PASSWORD_RESET_REQUEST });
  
  try {
    const response = await authService.resetPassword(token, password);
    
    if (response.success) {
      dispatch({
        type: PASSWORD_RESET_SUCCESS
      });
      
      dispatch(setAlert('Password has been reset successfully', 'success'));
      return { success: true };
    } else {
      dispatch({
        type: PASSWORD_RESET_FAILURE,
        payload: response.message || 'Failed to reset password'
      });
      
      dispatch(setAlert(response.message || 'Failed to reset password', 'error'));
      return { success: false, message: response.message };
    }
  } catch (error) {
    const errorMsg = error.message || 'Failed to reset password';
    
    dispatch({
      type: PASSWORD_RESET_FAILURE,
      payload: errorMsg
    });
    
    dispatch(setAlert(errorMsg, 'error'));
    return { success: false, message: errorMsg };
  }
};