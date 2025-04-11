// src/redux/reducers/authReducer.js
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAILURE,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('cephas_auth_token'),
  isAuthenticated: null,
  loading: false,
  user: JSON.parse(localStorage.getItem('cephas_user')) || null,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Loading states
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case REFRESH_TOKEN_REQUEST:
    case PASSWORD_RESET_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    // Login success
    case LOGIN_SUCCESS:
      localStorage.setItem('cephas_auth_token', action.payload.token);
      localStorage.setItem('cephas_user', JSON.stringify(action.payload.user));
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
        error: null
      };
    
    // Register success
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    
    // Token refresh success
    case REFRESH_TOKEN_SUCCESS:
      localStorage.setItem('cephas_auth_token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    // Password reset success
    case PASSWORD_RESET_SUCCESS:
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    
    // Profile update success
    case UPDATE_PROFILE_SUCCESS:
      localStorage.setItem('cephas_user', JSON.stringify(action.payload));
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null
      };
    
    // Error states
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case REFRESH_TOKEN_FAILURE:
    case PASSWORD_RESET_FAILURE:
    case FORGOT_PASSWORD_FAILURE:
    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Logout
    case LOGOUT:
      localStorage.removeItem('cephas_auth_token');
      localStorage.removeItem('cephas_user');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null
      };
    
    // Default case
    default:
      return state;
  }
};

export default authReducer;