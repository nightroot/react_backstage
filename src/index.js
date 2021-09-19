import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'

import reportWebVitals from './reportWebVitals';
import RouterConfig from '@/routes/index';

// Provider负责传递store
import { Provider } from 'react-redux'


// store数据持久化
import { PersistGate } from 'redux-persist/es/integration/react';
import { persistor, store } from './redux/index'
// const { persistor, store } = configureStore();


ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <RouterConfig />
    </PersistGate>
  </Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
