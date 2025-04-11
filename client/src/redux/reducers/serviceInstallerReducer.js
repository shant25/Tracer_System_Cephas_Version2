// src/redux/reducers/serviceInstallerReducer.js
import {
  FETCH_SERVICE_INSTALLERS_REQUEST,
  FETCH_SERVICE_INSTALLERS_SUCCESS,
  FETCH_SERVICE_INSTALLERS_FAILURE,
  FETCH_SERVICE_INSTALLER_REQUEST,
  FETCH_SERVICE_INSTALLER_SUCCESS,
  FETCH_SERVICE_INSTALLER_FAILURE,
  CREATE_SERVICE_INSTALLER_REQUEST,
  CREATE_SERVICE_INSTALLER_SUCCESS,
  CREATE_SERVICE_INSTALLER_FAILURE,
  UPDATE_SERVICE_INSTALLER_REQUEST,
  UPDATE_SERVICE_INSTALLER_SUCCESS,
  UPDATE_SERVICE_INSTALLER_FAILURE,
  DELETE_SERVICE_INSTALLER_REQUEST,
  DELETE_SERVICE_INSTALLER_SUCCESS,
  DELETE_SERVICE_INSTALLER_FAILURE,
  UPDATE_SERVICE_INSTALLER_STATUS_REQUEST,
  UPDATE_SERVICE_INSTALLER_STATUS_SUCCESS,
  UPDATE_SERVICE_INSTALLER_STATUS_FAILURE,
  FETCH_SERVICE_INSTALLER_ASSIGNMENTS_REQUEST,
  FETCH_SERVICE_INSTALLER_ASSIGNMENTS_SUCCESS,
  FETCH_SERVICE_INSTALLER_ASSIGNMENTS_FAILURE,
  FETCH_SERVICE_INSTALLER_PERFORMANCE_REQUEST,
  FETCH_SERVICE_INSTALLER_PERFORMANCE_SUCCESS,
  FETCH_SERVICE_INSTALLER_PERFORMANCE_FAILURE
} from '../actions/types';

const initialState = {
  serviceInstallers: [],
  serviceInstaller: null,
  assignments: [],
  performance: null,
  loading: false,
  error: null
};

const serviceInstallerReducer = (state = initialState, action) => {
  switch (action.type) {
    // Loading states
    case FETCH_SERVICE_INSTALLERS_REQUEST:
    case FETCH_SERVICE_INSTALLER_REQUEST:
    case CREATE_SERVICE_INSTALLER_REQUEST:
    case UPDATE_SERVICE_INSTALLER_REQUEST:
    case DELETE_SERVICE_INSTALLER_REQUEST:
    case UPDATE_SERVICE_INSTALLER_STATUS_REQUEST:
    case FETCH_SERVICE_INSTALLER_ASSIGNMENTS_REQUEST:
    case FETCH_SERVICE_INSTALLER_PERFORMANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    // Fetch service installers success
    case FETCH_SERVICE_INSTALLERS_SUCCESS:
      return {
        ...state,
        serviceInstallers: action.payload,
        loading: false,
        error: null
      };
    
    // Fetch single service installer success
    case FETCH_SERVICE_INSTALLER_SUCCESS:
      return {
        ...state,
        serviceInstaller: action.payload,
        loading: false,
        error: null
      };
    
    // Create service installer success
    case CREATE_SERVICE_INSTALLER_SUCCESS:
      return {
        ...state,
        serviceInstallers: [...state.serviceInstallers, action.payload],
        serviceInstaller: action.payload,
        loading: false,
        error: null
      };
    
    // Update service installer success
    case UPDATE_SERVICE_INSTALLER_SUCCESS:
    case UPDATE_SERVICE_INSTALLER_STATUS_SUCCESS:
      return {
        ...state,
        serviceInstallers: state.serviceInstallers.map(installer => 
          installer.id === action.payload.id ? action.payload : installer
        ),
        serviceInstaller: state.serviceInstaller && state.serviceInstaller.id === action.payload.id ? action.payload : state.serviceInstaller,
        loading: false,
        error: null
      };
    
    // Delete service installer success
    case DELETE_SERVICE_INSTALLER_SUCCESS:
      return {
        ...state,
        serviceInstallers: state.serviceInstallers.filter(installer => installer.id !== action.payload),
        serviceInstaller: state.serviceInstaller && state.serviceInstaller.id === action.payload ? null : state.serviceInstaller,
        loading: false,
        error: null
      };
    
    // Fetch service installer assignments success
    case FETCH_SERVICE_INSTALLER_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        assignments: action.payload,
        loading: false,
        error: null
      };
    
    // Fetch service installer performance success
    case FETCH_SERVICE_INSTALLER_PERFORMANCE_SUCCESS:
      return {
        ...state,
        performance: action.payload,
        loading: false,
        error: null
      };
    
    // Error states
    case FETCH_SERVICE_INSTALLERS_FAILURE:
    case FETCH_SERVICE_INSTALLER_FAILURE:
    case CREATE_SERVICE_INSTALLER_FAILURE:
    case UPDATE_SERVICE_INSTALLER_FAILURE:
    case DELETE_SERVICE_INSTALLER_FAILURE:
    case UPDATE_SERVICE_INSTALLER_STATUS_FAILURE:
    case FETCH_SERVICE_INSTALLER_ASSIGNMENTS_FAILURE:
    case FETCH_SERVICE_INSTALLER_PERFORMANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Default case
    default:
      return state;
  }
};

export default serviceInstallerReducer;