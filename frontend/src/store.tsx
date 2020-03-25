import {createStore, applyMiddleware} from 'redux';
import reduxPromiseMiddleware from 'redux-promise-middleware';
import appReducers from './reducers/appReducers';

const store = createStore(appReducers, {}, applyMiddleware(reduxPromiseMiddleware));
export default store;
