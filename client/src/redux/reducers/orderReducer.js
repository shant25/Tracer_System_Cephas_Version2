// src/redux/reducers/orderReducer.js
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_ORDER_REQUEST,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  ASSIGN_SERVICE_INSTALLER_REQUEST,
  ASSIGN_SERVICE_INSTALLER_SUCCESS,
  ASSIGN_SERVICE_INSTALLER_FAILURE,
  FETCH_ORDER_HISTORY_REQUEST,
  FETCH_ORDER_HISTORY_SUCCESS,
  FETCH_ORDER_HISTORY_FAILURE
} from '../actions/types';

const initialState = {
  orders: [],
  order: null,
  history: [],
  loading: false,
  error: null
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Loading states
    case FETCH_ORDERS_REQUEST:
    case FETCH_ORDER_REQUEST:
    case CREATE_ORDER_REQUEST:
    case UPDATE_ORDER_REQUEST:
    case DELETE_ORDER_REQUEST:
    case UPDATE_ORDER_STATUS_REQUEST:
    case ASSIGN_SERVICE_INSTALLER_REQUEST:
    case FETCH_ORDER_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    // Fetch orders success
    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
        loading: false,
        error: null
      };
    
    // Fetch single order success
    case FETCH_ORDER_SUCCESS:
      return {
        ...state,
        order: action.payload,
        loading: false,
        error: null
      };
    
    // Create order success
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: [...state.orders, action.payload],
        order: action.payload,
        loading: false,
        error: null
      };
    
    // Update order success
    case UPDATE_ORDER_SUCCESS:
    case UPDATE_ORDER_STATUS_SUCCESS:
    case ASSIGN_SERVICE_INSTALLER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        ),
        order: state.order && state.order.id === action.payload.id ? action.payload : state.order,
        loading: false,
        error: null
      };
    
    // Delete order success
    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload),
        order: state.order && state.order.id === action.payload ? null : state.order,
        loading: false,
        error: null
      };
    
    // Fetch order history success
    case FETCH_ORDER_HISTORY_SUCCESS:
      return {
        ...state,
        history: action.payload,
        loading: false,
        error: null
      };
    
    // Error states
    case FETCH_ORDERS_FAILURE:
    case FETCH_ORDER_FAILURE:
    case CREATE_ORDER_FAILURE:
    case UPDATE_ORDER_FAILURE:
    case DELETE_ORDER_FAILURE:
    case UPDATE_ORDER_STATUS_FAILURE:
    case ASSIGN_SERVICE_INSTALLER_FAILURE:
    case FETCH_ORDER_HISTORY_FAILURE:
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

export default orderReducer;