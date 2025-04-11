// src/redux/reducers/buildingReducer.js
import {
  FETCH_BUILDINGS_REQUEST,
  FETCH_BUILDINGS_SUCCESS,
  FETCH_BUILDINGS_FAILURE,
  FETCH_BUILDING_REQUEST,
  FETCH_BUILDING_SUCCESS,
  FETCH_BUILDING_FAILURE,
  CREATE_BUILDING_REQUEST,
  CREATE_BUILDING_SUCCESS,
  CREATE_BUILDING_FAILURE,
  UPDATE_BUILDING_REQUEST,
  UPDATE_BUILDING_SUCCESS,
  UPDATE_BUILDING_FAILURE,
  DELETE_BUILDING_REQUEST,
  DELETE_BUILDING_SUCCESS,
  DELETE_BUILDING_FAILURE,
  FETCH_BUILDING_STATISTICS_REQUEST,
  FETCH_BUILDING_STATISTICS_SUCCESS,
  FETCH_BUILDING_STATISTICS_FAILURE
} from '../actions/types';

const initialState = {
  buildings: [],
  building: null,
  statistics: null,
  loading: false,
  error: null
};

const buildingReducer = (state = initialState, action) => {
  switch (action.type) {
    // Loading states
    case FETCH_BUILDINGS_REQUEST:
    case FETCH_BUILDING_REQUEST:
    case CREATE_BUILDING_REQUEST:
    case UPDATE_BUILDING_REQUEST:
    case DELETE_BUILDING_REQUEST:
    case FETCH_BUILDING_STATISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    // Fetch buildings success
    case FETCH_BUILDINGS_SUCCESS:
      return {
        ...state,
        buildings: action.payload,
        loading: false,
        error: null
      };
    
    // Fetch single building success
    case FETCH_BUILDING_SUCCESS:
      return {
        ...state,
        building: action.payload,
        loading: false,
        error: null
      };
    
    // Create building success
    case CREATE_BUILDING_SUCCESS:
      return {
        ...state,
        buildings: [...state.buildings, action.payload],
        building: action.payload,
        loading: false,
        error: null
      };
    
    // Update building success
    case UPDATE_BUILDING_SUCCESS:
      return {
        ...state,
        buildings: state.buildings.map(building => 
          building.id === action.payload.id ? action.payload : building
        ),
        building: action.payload,
        loading: false,
        error: null
      };
    
    // Delete building success
    case DELETE_BUILDING_SUCCESS:
      return {
        ...state,
        buildings: state.buildings.filter(building => building.id !== action.payload),
        building: state.building && state.building.id === action.payload ? null : state.building,
        loading: false,
        error: null
      };
    
    // Fetch building statistics success
    case FETCH_BUILDING_STATISTICS_SUCCESS:
      return {
        ...state,
        statistics: action.payload,
        loading: false,
        error: null
      };
    
    // Error states
    case FETCH_BUILDINGS_FAILURE:
    case FETCH_BUILDING_FAILURE:
    case CREATE_BUILDING_FAILURE:
    case UPDATE_BUILDING_FAILURE:
    case DELETE_BUILDING_FAILURE:
    case FETCH_BUILDING_STATISTICS_FAILURE:
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

export default buildingReducer;