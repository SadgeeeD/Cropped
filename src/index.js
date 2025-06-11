import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';

import { DataListProvider } from './contexts/DataProvider';

//Hooking React App to Root
ReactDOM.render(
  <ContextProvider>
    <DataListProvider>
      <App />
    </DataListProvider>
  </ContextProvider>,
  document.getElementById('root')
);