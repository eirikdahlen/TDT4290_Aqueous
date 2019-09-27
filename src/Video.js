/* eslint-disable max-len */
// The App for the VideoWindow. This is where every video-component should go.

import React, { useState, useEffect } from 'react';
import { CanvasBias } from './VideoComponents/canvasComponents/component_bias.js';
import { CanvasHeading } from './VideoComponents/canvasComponents/component_heading.js';
import { CanvasDepth } from './VideoComponents/canvasComponents/component_depth.js';
import './VideoComponents/css/overlay.css';
import './VideoComponents/css/Video.css';
import './VideoComponents/css/general.css';
import VideoFeed from './VideoComponents/VideoFeed';

const { remote } = window.require('electron');

function VideoApp() {
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));
  const [biasValues, biasUpdate] = useState(remote.getGlobal('bias'));

  useEffect(() => {
    window.ipcRenderer.on('data-received', () => {
      sensorUpdate(remote.getGlobal('fromROV'));
      biasUpdate(remote.getGlobal('bias'));
    });
  }, []);

  return (
    <div className="VideoApp">
      <CanvasBias
        u={biasValues['surge']}
        v={biasValues['sway']}
        w={biasValues['heave']}
      />
      <CanvasHeading heading={sensorValues['yaw']} />
      <CanvasDepth depth={sensorValues['down']} />
      <VideoFeed />
    </div>
  );
}

export default VideoApp;
