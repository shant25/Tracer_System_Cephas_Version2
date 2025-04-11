// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import buildingReducer from './buildingReducer';
import orderReducer from './orderReducer';
import activationReducer from './activationReducer';
import materialReducer from './materialReducer';
import serviceInstallerReducer from './serviceInstallerReducer';
import splitterReducer from './splitterReducer';
import uiReducer from './uiReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  building: buildingReducer,
  order: orderReducer,
  activation: activationReducer,
  material: materialReducer,
  serviceInstaller: serviceInstallerReducer,
  splitter: splitterReducer,
  ui: uiReducer
});

export default rootReducer;