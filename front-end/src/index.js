import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import UserProvider from './contexts/UserProvider.js'


ReactDOM.render(
  <React.StrictMode>  
    <UserProvider>
        <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


