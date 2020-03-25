
import React from 'react';
import ReactDom from 'react-dom';
import App from "./components/app";
import { Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory as createHistory } from 'history';
export const history = createHistory();
import store from './store';

ReactDom.render(
    <>
      <Provider store={store}>
        <Router history={history}>
          <Route path="*" render={props => <App {...props} />} />
        </Router>
      </Provider>
    </>,
  
    document.getElementById('app')
  );
  
