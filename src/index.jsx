//index.js is the file that is loaded when the app is loaded.
//Its component - ViewManager - handles which of Control.js and Video.js to load.

import React from 'react';
import ReactDOM from 'react-dom';
import { positions, Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import ViewManager from './ViewManager';
import './index.css';

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
};

const App = () => (
  <Provider template={AlertTemplate} {...options}>
    <ViewManager />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
