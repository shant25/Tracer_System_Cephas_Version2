// src/redux/reducers/uiReducer.js
import {
  SET_ALERT,
  REMOVE_ALERT,
  TOGGLE_SIDEBAR,
  SET_LOADING,
  SET_PAGE_TITLE,
  CLEAR_ALERTS,
  TOGGLE_THEME,
  SET_LANGUAGE,
  OPEN_MODAL,
  CLOSE_MODAL
} from '../actions/types';

const initialState = {
  alerts: [],
  sidebarOpen: true,
  loading: false,
  pageTitle: 'Dashboard',
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('language') || 'en',
  modals: {}
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    // Set alert
    case SET_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload]
      };
    
    // Remove alert
    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      };
    
    // Clear all alerts
    case CLEAR_ALERTS:
      return {
        ...state,
        alerts: []
      };
    
    // Toggle sidebar
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    
    // Set loading state
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    // Set page title
    case SET_PAGE_TITLE:
      return {
        ...state,
        pageTitle: action.payload
      };
    
    // Toggle theme
    case TOGGLE_THEME:
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return {
        ...state,
        theme: newTheme
      };
    
    // Set language
    case SET_LANGUAGE:
      localStorage.setItem('language', action.payload);
      return {
        ...state,
        language: action.payload
      };
    
    // Open modal
    case OPEN_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modalId]: {
            isOpen: true,
            props: action.payload.modalProps
          }
        }
      };
    
    // Close modal
    case CLOSE_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: {
            ...state.modals[action.payload],
            isOpen: false
          }
        }
      };
    
    // Default case
    default:
      return state;
  }
};

export default uiReducer;