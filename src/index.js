import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { AuthProvider } from './contexts/AuthContext';
import { DataListProvider } from './contexts/DataProvider';

//Hooking React App to Root
ReactDOM.render(
  <AuthProvider>
  <ContextProvider>
      <DataListProvider>
        <App />
      </DataListProvider>
  </ContextProvider>
  </AuthProvider>,
  document.getElementById('root')
);