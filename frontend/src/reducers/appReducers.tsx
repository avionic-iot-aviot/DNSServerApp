import { combineReducers } from 'redux';
import userReducer from './userReducer';

import notificationReducer from './notificationReducer';

const appReducers = combineReducers({
    userReducer,
    notificationReducer
});

export default appReducers;
