import React from 'react';
import ReactDOM from 'react-dom';
import './assets/less/index.less';
import { HashRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import appReducers from './store/reducers';

const store = createStore(appReducers);

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root'),
);
