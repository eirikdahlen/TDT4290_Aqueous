//index.js is the file that is loaded when the app is loaded.
//Its component - ViewManager - handles which of Control.js and Video.js to load.

import React from 'react';
import ReactDOM from 'react-dom';
import ViewManager from './ViewManager';
import './index.css';
import GamepadWrapper from './GamepadWrapper';

ReactDOM.render(
  <div>
    <ViewManager />
    <GamepadWrapper className="GamepadWrapper" />
  </div>,
  document.getElementById('root'),
);
