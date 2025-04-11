// src/redux/reducers/splitterReducer.js
import {
  FETCH_SPLITTERS_REQUEST,
  FETCH_SPLITTERS_SUCCESS,
  FETCH_SPLITTERS_FAILURE,
  FETCH_SPLITTER_REQUEST,
  FETCH_SPLITTER_SUCCESS,
  FETCH_SPLITTER_FAILURE,
  CREATE_SPLITTER_REQUEST,
  CREATE_SPLITTER_SUCCESS,
  CREATE_SPLITTER_FAILURE,
  UPDATE_SPLITTER_REQUEST,
  UPDATE_SPLITTER_SUCCESS,
  UPDATE_SPLITTER_FAILURE,
  DELETE_SPLITTER_REQUEST,
  DELETE_SPLITTER_SUCCESS,
  DELETE_SPLITTER_FAILURE,
  FETCH_BUILDING_SPLITTERS_REQUEST,
  FETCH_BUILDING_SPLITTERS_SUCCESS,
  FETCH_BUILDING_SPLITTERS_FAILURE,
  ASSIGN_SERVICE_TO_PORT_REQUEST,
  ASSIGN_SERVICE_TO_PORT_SUCCESS,
  ASSIGN_SERVICE_TO_PORT_FAILURE,
  RELEASE_PORT_REQUEST,
  RELEASE_PORT_SUCCESS,
  RELEASE_PORT_FAILURE,
  CHECK_PORT_AVAILABILITY_REQUEST,
  CHECK_PORT_AVAILABILITY_SUCCESS,
  CHECK_PORT_AVAILABILITY_FAILURE
} from '../actions/types';

const initialState = {
  splitters: [],
  splitter: null,
  buildingSplitters: {},
  portAvailability: null,
  loading: false,
  error: null
};

const splitterReducer = (state = initialState, action) => {
  switch (action.type) {
    // Loading states
    case FETCH_SPLITTERS_REQUEST:
    case FETCH_SPLITTER_REQUEST:
    case CREATE_SPLITTER_REQUEST:
    case UPDATE_SPLITTER_REQUEST:
    case DELETE_SPLITTER_REQUEST:
    case FETCH_BUILDING_SPLITTERS_REQUEST:
    case ASSIGN_SERVICE_TO_PORT_REQUEST:
    case RELEASE_PORT_REQUEST:
    case CHECK_PORT_AVAILABILITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    // Fetch splitters success
    case FETCH_SPLITTERS_SUCCESS:
      return {
        ...state,
        splitters: action.payload,
        loading: false,
        error: null
      };
    
    // Fetch single splitter success
    case FETCH_SPLITTER_SUCCESS:
      return {
        ...state,
        splitter: action.payload,
        loading: false,
        error: null
      };
    
    // Create splitter success
    case CREATE_SPLITTER_SUCCESS:
      return {
        ...state,
        splitters: [...state.splitters, action.payload],
        splitter: action.payload,
        loading: false,
        error: null
      };
    
    // Update splitter success
    case UPDATE_SPLITTER_SUCCESS:
      return {
        ...state,
        splitters: state.splitters.map(splitter => 
          splitter.id === action.payload.id ? action.payload : splitter
        ),
        splitter: state.splitter && state.splitter.id === action.payload.id ? action.payload : state.splitter,
        loading: false,
        error: null
      };
    
    // Delete splitter success
    case DELETE_SPLITTER_SUCCESS:
      return {
        ...state,
        splitters: state.splitters.filter(splitter => splitter.id !== action.payload),
        splitter: state.splitter && state.splitter.id === action.payload ? null : state.splitter,
        loading: false,
        error: null
      };
    
    // Fetch building splitters success
    case FETCH_BUILDING_SPLITTERS_SUCCESS:
      return {
        ...state,
        buildingSplitters: {
          ...state.buildingSplitters,
          [action.payload.buildingId]: action.payload.splitters
        },
        loading: false,
        error: null
      };
    
    // Assign service to port success
    case ASSIGN_SERVICE_TO_PORT_SUCCESS:
      return {
        ...state,
        splitter: action.payload,
        loading: false,
        error: null
      };
    
    // Release port success
    case RELEASE_PORT_SUCCESS:
      return {
        ...state,
        splitter: state.splitter && state.splitter.id === action.payload.splitterId 
          ? { ...state.splitter, ports: { ...state.splitter.ports, [action.payload.port]: null } }
          : state.splitter,
        loading: false,
        error: null
      };
    
    // Check port availability success
    case CHECK_PORT_AVAILABILITY_SUCCESS:
      return {
        ...state,
        portAvailability: action.payload,
        loading: false,
        error: null
      };
    
    // Error states
    case FETCH_SPLITTERS_FAILURE:
    case FETCH_SPLITTER_FAILURE:
    case CREATE_SPLITTER_FAILURE:
    case UPDATE_SPLITTER_FAILURE:
    case DELETE_SPLITTER_FAILURE:
    case FETCH_BUILDING_SPLITTERS_FAILURE:
    case ASSIGN_SERVICE_TO_PORT_FAILURE:
    case RELEASE_PORT_FAILURE:
    case CHECK_PORT_AVAILABILITY_FAILURE:
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

export default splitterReducer;