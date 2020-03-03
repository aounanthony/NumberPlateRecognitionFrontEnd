import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import cameraReducer from './cameraReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
    errors: errorReducer,
    auth: authReducer,
    cameras: cameraReducer,
    settings: settingsReducer,
});