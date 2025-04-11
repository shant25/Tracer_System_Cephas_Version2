// client/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Import reducers
import authReducer from './reducers/authReducer';
import buildingReducer from './reducers/buildingReducer';
import orderReducer from './reducers/orderReducer';
import activationReducer from './reducers/activationReducer';
import materialReducer from './reducers/materialReducer';
import serviceInstallerReducer from './reducers/serviceInstallerReducer';
import splitterReducer from './reducers/splitterReducer';
import uiReducer from './reducers/uiReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  buildings: buildingReducer,
  orders: orderReducer,
  activations: activationReducer,
  materials: materialReducer,
  serviceInstallers: serviceInstallerReducer,
  splitters: splitterReducer,
  ui: uiReducer
});

// Configure store with middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;