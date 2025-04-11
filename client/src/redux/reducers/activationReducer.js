// client/src/redux/reducers/activationReducer.js
import {
  FETCH_ACTIVATIONS_REQUEST,
  FETCH_ACTIVATIONS_SUCCESS,
  FETCH_ACTIVATIONS_FAILURE,
  FETCH_ACTIVATION_DETAIL_REQUEST,
  FETCH_ACTIVATION_DETAIL_SUCCESS,
  FETCH_ACTIVATION_DETAIL_FAILURE,
  CREATE_ACTIVATION_REQUEST,
  CREATE_ACTIVATION_SUCCESS,
  CREATE_ACTIVATION_FAILURE,
  UPDATE_ACTIVATION_REQUEST,
  UPDATE_ACTIVATION_SUCCESS,
  UPDATE_ACTIVATION_FAILURE,
  DELETE_ACTIVATION_REQUEST,
  DELETE_ACTIVATION_SUCCESS,
  DELETE_ACTIVATION_FAILURE,
  ASSIGN_INSTALLER_REQUEST,
  ASSIGN_INSTALLER_SUCCESS,
  ASSIGN_INSTALLER_FAILURE,
  ASSIGN_MATERIALS_REQUEST,
  ASSIGN_MATERIALS_SUCCESS,
  ASSIGN_MATERIALS_FAILURE,
  UPDATE_ACTIVATION_STATUS_REQUEST,
  UPDATE_ACTIVATION_STATUS_SUCCESS,
  UPDATE_ACTIVATION_STATUS_FAILURE,
  CLEAR_ACTIVATION_ERROR
} from '../actions/types';

// Initial state
const initialState = {
  activations: [],
  currentActivation: null,
  loading: false,
  error: null,
  success: false,
  totalCount: 0,
  statusCounts: {
    NOT_COMPLETED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELED: 0
  }
};

const activationReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ACTIVATIONS_REQUEST:
    case FETCH_ACTIVATION_DETAIL_REQUEST:
    case CREATE_ACTIVATION_REQUEST:
    case UPDATE_ACTIVATION_REQUEST:
    case DELETE_ACTIVATION_REQUEST:
    case ASSIGN_INSTALLER_REQUEST:
    case ASSIGN_MATERIALS_REQUEST:
    case UPDATE_ACTIVATION_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };

    case FETCH_ACTIVATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        activations: payload.activations,
        totalCount: payload.totalCount || payload.activations.length,
        statusCounts: payload.statusCounts || state.statusCounts,
        error: null
      };

    case FETCH_ACTIVATION_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        currentActivation: payload,
        error: null
      };

    case CREATE_ACTIVATION_SUCCESS:
      return {
        ...state,
        loading: false,
        activations: [...state.activations, payload],
        currentActivation: payload,
        success: true,
        error: null
      };

    case UPDATE_ACTIVATION_SUCCESS:
    case UPDATE_ACTIVATION_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        activations: state.activations.map(activation => 
          activation.id === payload.id ? payload : activation
        ),
        currentActivation: state.currentActivation?.id === payload.id ? 
          payload : state.currentActivation,
        success: true,
        error: null
      };

    case ASSIGN_INSTALLER_SUCCESS:
      return {
        ...state,
        loading: false,
        activations: state.activations.map(activation => 
          activation.id === payload.id ? {
            ...activation,
            serviceInstallerId: payload.serviceInstallerId,
            serviceInstaller: payload.serviceInstaller,
            status: payload.status || activation.status
          } : activation
        ),
        currentActivation: state.currentActivation?.id === payload.id ? {
          ...state.currentActivation,
          serviceInstallerId: payload.serviceInstallerId,
          serviceInstaller: payload.serviceInstaller,
          status: payload.status || state.currentActivation.status
        } : state.currentActivation,
        success: true,
        error: null
      };
      
    case ASSIGN_MATERIALS_SUCCESS:
      return {
        ...state,
        loading: false,
        activations: state.activations.map(activation => 
          activation.id === payload.id ? {
            ...activation,
            materialsAssigned: true,
            materials: payload.materials
          } : activation
        ),
        currentActivation: state.currentActivation?.id === payload.id ? {
          ...state.currentActivation,
          materialsAssigned: true,
          materials: payload.materials
        } : state.currentActivation,
        success: true,
        error: null
      };

    case DELETE_ACTIVATION_SUCCESS:
      return {
        ...state,
        loading: false,
        activations: state.activations.filter(activation => activation.id !== payload),
        currentActivation: state.currentActivation?.id === payload ? null : state.currentActivation,
        success: true,
        error: null
      };

    case FETCH_ACTIVATIONS_FAILURE:
    case FETCH_ACTIVATION_DETAIL_FAILURE:
    case CREATE_ACTIVATION_FAILURE:
    case UPDATE_ACTIVATION_FAILURE:
    case DELETE_ACTIVATION_FAILURE:
    case ASSIGN_INSTALLER_FAILURE:
    case ASSIGN_MATERIALS_FAILURE:
    case UPDATE_ACTIVATION_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
        success: false
      };

    case CLEAR_ACTIVATION_ERROR:
      return {
        ...state,
        error: null,
        success: false
      };

    default:
      return state;
  }
};

export default activationReducer;