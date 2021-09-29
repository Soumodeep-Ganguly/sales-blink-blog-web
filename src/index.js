import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import './index.css'

import {
  BrowserRouter
} from 'react-router-dom';

import App from './App'

ReactDOM.render(
  <BrowserRouter>
      <App />
  </BrowserRouter>
, document.getElementById('root'));