// src/redux/reducers/materialReducer.js
import {
  FETCH_MATERIALS_REQUEST,
  FETCH_MATERIALS_SUCCESS,
  FETCH_MATERIALS_FAILURE,
  FETCH_MATERIAL_REQUEST,
  FETCH_MATERIAL_SUCCESS,
  FETCH_MATERIAL_FAILURE,
  CREATE_MATERIAL_REQUEST,
  CREATE_MATERIAL_SUCCESS,
  CREATE_MATERIAL_FAILURE,
  UPDATE_MATERIAL_REQUEST,
  UPDATE_MATERIAL_SUCCESS,
  UPDATE_MATERIAL_FAILURE,
  DELETE_MATERIAL_REQUEST,
  DELETE_MATERIAL_SUCCESS,
  DELETE_MATERIAL_FAILURE,
  UPDATE_MATERIAL_STOCK_REQUEST,
  UPDATE_MATERIAL_STOCK_SUCCESS,
  UPDATE_MATERIAL_STOCK_FAILURE,
  FETCH_LOW_STOCK_MATERIALS_REQUEST,
  FETCH_LOW_STOCK_MATERIALS_SUCCESS,
  FETCH_LOW_STOCK_MATERIALS_FAILURE
} from '../actions/types';

const initialState = {
  materials: [],
  material: null,
  lowStockMaterials: [],
  loading: false,
  error: null
};

const materialReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch materials
    case FETCH_MATERIALS_REQUEST:
    case FETCH_MATERIAL_REQUEST:
    case CREATE_MATERIAL_REQUEST:
    case UPDATE_MATERIAL_REQUEST:
    case DELETE_MATERIAL_REQUEST:
    case UPDATE_MATERIAL_STOCK_REQUEST:
    case FETCH_LOW_STOCK_MATERIALS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    // Fetch materials success
    case FETCH_MATERIALS_SUCCESS:
      return {
        ...state,
        materials: action.payload,
        loading: false,
        error: null
      };
    
    // Fetch single material success
    case FETCH_MATERIAL_SUCCESS:
      return {
        ...state,
        material: action.payload,
        loading: false,
        error: null
      };
    
    // Create material success
    case CREATE_MATERIAL_SUCCESS:
      return {
        ...state,
        materials: [...state.materials, action.payload],
        loading: false,
        error: null
      };
    
    // Update material success
    case UPDATE_MATERIAL_SUCCESS:
    case UPDATE_MATERIAL_STOCK_SUCCESS:
      return {
        ...state,
        materials: state.materials.map(material => 
          material.id === action.payload.id ? action.payload : material
        ),
        material: state.material && state.material.id === action.payload.id ? action.payload : state.material,
        loading: false,
        error: null
      };
    
    // Delete material success
    case DELETE_MATERIAL_SUCCESS:
      return {
        ...state,
        materials: state.materials.filter(material => material.id !== action.payload),
        loading: false,
        error: null
      };
    
    // Fetch low stock materials success
    case FETCH_LOW_STOCK_MATERIALS_SUCCESS:
      return {
        ...state,
        lowStockMaterials: action.payload,
        loading: false,
        error: null
      };
    
    // Handle all failure cases
    case FETCH_MATERIALS_FAILURE:
    case FETCH_MATERIAL_FAILURE:
    case CREATE_MATERIAL_FAILURE:
    case UPDATE_MATERIAL_FAILURE:
    case DELETE_MATERIAL_FAILURE:
    case UPDATE_MATERIAL_STOCK_FAILURE:
    case FETCH_LOW_STOCK_MATERIALS_FAILURE:
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

export default materialReducer;