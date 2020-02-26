
import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route } from 'react-router-dom';

import { createBrowserHistory as createHistory } from 'history';
export const history = createHistory();

ReactDom.render(
    <h2>
        DNS Server
    </h2>,
    document.getElementById('app')
);

