import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux'
import reducer from './components/Reducers/index';
import thunk from 'redux-thunk';


const initialState = {
	loading: false,
	loaded: false,
  registryAddress: '',
  accessControlAddress: '',
  roleBindingAddress: '',
  taskRoleMapAddress: '',
  processCaseAddress: [],
	error: null,
  accessControlAddressWebSocket: '',
};

const middleware = applyMiddleware(thunk);

const store = createStore(reducer, initialState, 
  compose(
    middleware,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
registerServiceWorker();
