// client/src/redux/actions/types.js

// Authentication Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST';
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
export const PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE';
export const PASSWORD_FORGOT_REQUEST = 'PASSWORD_FORGOT_REQUEST';
export const PASSWORD_FORGOT_SUCCESS = 'PASSWORD_FORGOT_SUCCESS';
export const PASSWORD_FORGOT_FAILURE = 'PASSWORD_FORGOT_FAILURE';

// Building Types
export const FETCH_BUILDINGS_REQUEST = 'FETCH_BUILDINGS_REQUEST';
export const FETCH_BUILDINGS_SUCCESS = 'FETCH_BUILDINGS_SUCCESS';
export const FETCH_BUILDINGS_FAILURE = 'FETCH_BUILDINGS_FAILURE';
export const FETCH_BUILDING_DETAIL_REQUEST = 'FETCH_BUILDING_DETAIL_REQUEST';
export const FETCH_BUILDING_DETAIL_SUCCESS = 'FETCH_BUILDING_DETAIL_SUCCESS';
export const FETCH_BUILDING_DETAIL_FAILURE = 'FETCH_BUILDING_DETAIL_FAILURE';
export const CREATE_BUILDING_REQUEST = 'CREATE_BUILDING_REQUEST';
export const CREATE_BUILDING_SUCCESS = 'CREATE_BUILDING_SUCCESS';
export const CREATE_BUILDING_FAILURE = 'CREATE_BUILDING_FAILURE';
export const UPDATE_BUILDING_REQUEST = 'UPDATE_BUILDING_REQUEST';
export const UPDATE_BUILDING_SUCCESS = 'UPDATE_BUILDING_SUCCESS';
export const UPDATE_BUILDING_FAILURE = 'UPDATE_BUILDING_FAILURE';
export const DELETE_BUILDING_REQUEST = 'DELETE_BUILDING_REQUEST';
export const DELETE_BUILDING_SUCCESS = 'DELETE_BUILDING_SUCCESS';
export const DELETE_BUILDING_FAILURE = 'DELETE_BUILDING_FAILURE';
export const CLEAR_BUILDING_ERROR = 'CLEAR_BUILDING_ERROR';

// Order Types
export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';
export const FETCH_ORDER_DETAIL_REQUEST = 'FETCH_ORDER_DETAIL_REQUEST';
export const FETCH_ORDER_DETAIL_SUCCESS = 'FETCH_ORDER_DETAIL_SUCCESS';
export const FETCH_ORDER_DETAIL_FAILURE = 'FETCH_ORDER_DETAIL_FAILURE';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
export const UPDATE_ORDER_REQUEST = 'UPDATE_ORDER_REQUEST';
export const UPDATE_ORDER_SUCCESS = 'UPDATE_ORDER_SUCCESS';
export const UPDATE_ORDER_FAILURE = 'UPDATE_ORDER_FAILURE';
export const DELETE_ORDER_REQUEST = 'DELETE_ORDER_REQUEST';
export const DELETE_ORDER_SUCCESS = 'DELETE_ORDER_SUCCESS';
export const DELETE_ORDER_FAILURE = 'DELETE_ORDER_FAILURE';
export const UPDATE_ORDER_STATUS_REQUEST = 'UPDATE_ORDER_STATUS_REQUEST';
export const UPDATE_ORDER_STATUS_SUCCESS = 'UPDATE_ORDER_STATUS_SUCCESS';
export const UPDATE_ORDER_STATUS_FAILURE = 'UPDATE_ORDER_STATUS_FAILURE';
export const CLEAR_ORDER_ERROR = 'CLEAR_ORDER_ERROR';

// Activation Types
export const FETCH_ACTIVATIONS_REQUEST = 'FETCH_ACTIVATIONS_REQUEST';
export const FETCH_ACTIVATIONS_SUCCESS = 'FETCH_ACTIVATIONS_SUCCESS';
export const FETCH_ACTIVATIONS_FAILURE = 'FETCH_ACTIVATIONS_FAILURE';
export const FETCH_ACTIVATION_DETAIL_REQUEST = 'FETCH_ACTIVATION_DETAIL_REQUEST';
export const FETCH_ACTIVATION_DETAIL_SUCCESS = 'FETCH_ACTIVATION_DETAIL_SUCCESS';
export const FETCH_ACTIVATION_DETAIL_FAILURE = 'FETCH_ACTIVATION_DETAIL_FAILURE';
export const CREATE_ACTIVATION_REQUEST = 'CREATE_ACTIVATION_REQUEST';
export const CREATE_ACTIVATION_SUCCESS = 'CREATE_ACTIVATION_SUCCESS';
export const CREATE_ACTIVATION_FAILURE = 'CREATE_ACTIVATION_FAILURE';
export const UPDATE_ACTIVATION_REQUEST = 'UPDATE_ACTIVATION_REQUEST';
export const UPDATE_ACTIVATION_SUCCESS = 'UPDATE_ACTIVATION_SUCCESS';
export const UPDATE_ACTIVATION_FAILURE = 'UPDATE_ACTIVATION_FAILURE';
export const DELETE_ACTIVATION_REQUEST = 'DELETE_ACTIVATION_REQUEST';
export const DELETE_ACTIVATION_SUCCESS = 'DELETE_ACTIVATION_SUCCESS';
export const DELETE_ACTIVATION_FAILURE = 'DELETE_ACTIVATION_FAILURE';
export const ASSIGN_INSTALLER_REQUEST = 'ASSIGN_INSTALLER_REQUEST';
export const ASSIGN_INSTALLER_SUCCESS = 'ASSIGN_INSTALLER_SUCCESS';
export const ASSIGN_INSTALLER_FAILURE = 'ASSIGN_INSTALLER_FAILURE';
export const ASSIGN_MATERIALS_REQUEST = 'ASSIGN_MATERIALS_REQUEST';
export const ASSIGN_MATERIALS_SUCCESS = 'ASSIGN_MATERIALS_SUCCESS';
export const ASSIGN_MATERIALS_FAILURE = 'ASSIGN_MATERIALS_FAILURE';
export const UPDATE_ACTIVATION_STATUS_REQUEST = 'UPDATE_ACTIVATION_STATUS_REQUEST';
export const UPDATE_ACTIVATION_STATUS_SUCCESS = 'UPDATE_ACTIVATION_STATUS_SUCCESS';
export const UPDATE_ACTIVATION_STATUS_FAILURE = 'UPDATE_ACTIVATION_STATUS_FAILURE';
export const CLEAR_ACTIVATION_ERROR = 'CLEAR_ACTIVATION_ERROR';

// Material Types
export const FETCH_MATERIALS_REQUEST = 'FETCH_MATERIALS_REQUEST';
export const FETCH_MATERIALS_SUCCESS = 'FETCH_MATERIALS_SUCCESS';
export const FETCH_MATERIALS_FAILURE = 'FETCH_MATERIALS_FAILURE';
export const FETCH_MATERIAL_DETAIL_REQUEST = 'FETCH_MATERIAL_DETAIL_REQUEST';
export const FETCH_MATERIAL_DETAIL_SUCCESS = 'FETCH_MATERIAL_DETAIL_SUCCESS';
export const FETCH_MATERIAL_DETAIL_FAILURE = 'FETCH_MATERIAL_DETAIL_FAILURE';
export const CREATE_MATERIAL_REQUEST = 'CREATE_MATERIAL_REQUEST';
export const CREATE_MATERIAL_SUCCESS = 'CREATE_MATERIAL_SUCCESS';
export const CREATE_MATERIAL_FAILURE = 'CREATE_MATERIAL_FAILURE';
export const UPDATE_MATERIAL_REQUEST = 'UPDATE_MATERIAL_REQUEST';
export const UPDATE_MATERIAL_SUCCESS = 'UPDATE_MATERIAL_SUCCESS';
export const UPDATE_MATERIAL_FAILURE = 'UPDATE_MATERIAL_FAILURE';
export const DELETE_MATERIAL_REQUEST = 'DELETE_MATERIAL_REQUEST';
export const DELETE_MATERIAL_SUCCESS = 'DELETE_MATERIAL_SUCCESS';
export const DELETE_MATERIAL_FAILURE = 'DELETE_MATERIAL_FAILURE';
export const ADD_MATERIAL_STOCK_REQUEST = 'ADD_MATERIAL_STOCK_REQUEST';
export const ADD_MATERIAL_STOCK_SUCCESS = 'ADD_MATERIAL_STOCK_SUCCESS';
export const ADD_MATERIAL_STOCK_FAILURE = 'ADD_MATERIAL_STOCK_FAILURE';
export const REMOVE_MATERIAL_STOCK_REQUEST = 'REMOVE_MATERIAL_STOCK_REQUEST';
export const REMOVE_MATERIAL_STOCK_SUCCESS = 'REMOVE_MATERIAL_STOCK_SUCCESS';
export const REMOVE_MATERIAL_STOCK_FAILURE = 'REMOVE_MATERIAL_STOCK_FAILURE';
export const CLEAR_MATERIAL_ERROR = 'CLEAR_MATERIAL_ERROR';

// Service Installer Types
export const FETCH_SERVICE_INSTALLERS_REQUEST = 'FETCH_SERVICE_INSTALLERS_REQUEST';
export const FETCH_SERVICE_INSTALLERS_SUCCESS = 'FETCH_SERVICE_INSTALLERS_SUCCESS';
export const FETCH_SERVICE_INSTALLERS_FAILURE = 'FETCH_SERVICE_INSTALLERS_FAILURE';
export const FETCH_SERVICE_INSTALLER_DETAIL_REQUEST = 'FETCH_SERVICE_INSTALLER_DETAIL_REQUEST';
export const FETCH_SERVICE_INSTALLER_DETAIL_SUCCESS = 'FETCH_SERVICE_INSTALLER_DETAIL_SUCCESS';
export const FETCH_SERVICE_INSTALLER_DETAIL_FAILURE = 'FETCH_SERVICE_INSTALLER_DETAIL_FAILURE';
export const CREATE_SERVICE_INSTALLER_REQUEST = 'CREATE_SERVICE_INSTALLER_REQUEST';
export const CREATE_SERVICE_INSTALLER_SUCCESS = 'CREATE_SERVICE_INSTALLER_SUCCESS';
export const CREATE_SERVICE_INSTALLER_FAILURE = 'CREATE_SERVICE_INSTALLER_FAILURE';
export const UPDATE_SERVICE_INSTALLER_REQUEST = 'UPDATE_SERVICE_INSTALLER_REQUEST';
export const UPDATE_SERVICE_INSTALLER_SUCCESS = 'UPDATE_SERVICE_INSTALLER_SUCCESS';
export const UPDATE_SERVICE_INSTALLER_FAILURE = 'UPDATE_SERVICE_INSTALLER_FAILURE';
export const DELETE_SERVICE_INSTALLER_REQUEST = 'DELETE_SERVICE_INSTALLER_REQUEST';
export const DELETE_SERVICE_INSTALLER_SUCCESS = 'DELETE_SERVICE_INSTALLER_SUCCESS';
export const DELETE_SERVICE_INSTALLER_FAILURE = 'DELETE_SERVICE_INSTALLER_FAILURE';
export const CLEAR_SERVICE_INSTALLER_ERROR = 'CLEAR_SERVICE_INSTALLER_ERROR';

// Splitter Types
export const FETCH_SPLITTERS_REQUEST = 'FETCH_SPLITTERS_REQUEST';
export const FETCH_SPLITTERS_SUCCESS = 'FETCH_SPLITTERS_SUCCESS';
export const FETCH_SPLITTERS_FAILURE = 'FETCH_SPLITTERS_FAILURE';
export const FETCH_SPLITTER_DETAIL_REQUEST = 'FETCH_SPLITTER_DETAIL_REQUEST';
export const FETCH_SPLITTER_DETAIL_SUCCESS = 'FETCH_SPLITTER_DETAIL_SUCCESS';
export const FETCH_SPLITTER_DETAIL_FAILURE = 'FETCH_SPLITTER_DETAIL_FAILURE';
export const CREATE_SPLITTER_REQUEST = 'CREATE_SPLITTER_REQUEST';
export const CREATE_SPLITTER_SUCCESS = 'CREATE_SPLITTER_SUCCESS';
export const CREATE_SPLITTER_FAILURE = 'CREATE_SPLITTER_FAILURE';
export const UPDATE_SPLITTER_REQUEST = 'UPDATE_SPLITTER_REQUEST';
export const UPDATE_SPLITTER_SUCCESS = 'UPDATE_SPLITTER_SUCCESS';
export const UPDATE_SPLITTER_FAILURE = 'UPDATE_SPLITTER_FAILURE';
export const DELETE_SPLITTER_REQUEST = 'DELETE_SPLITTER_REQUEST';
export const DELETE_SPLITTER_SUCCESS = 'DELETE_SPLITTER_SUCCESS';
export const DELETE_SPLITTER_FAILURE = 'DELETE_SPLITTER_FAILURE';
export const CLEAR_SPLITTER_ERROR = 'CLEAR_SPLITTER_ERROR';

// UI Types
export const SET_LOADING = 'SET_LOADING';
export const CLEAR_LOADING = 'CLEAR_LOADING';
export const SET_ALERT = 'SET_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN';
export const SET_SIDEBAR_CLOSED = 'SET_SIDEBAR_CLOSED';
export const SET_MOBILE_VIEW = 'SET_MOBILE_VIEW';
export const SET_DESKTOP_VIEW = 'SET_DESKTOP_VIEW';