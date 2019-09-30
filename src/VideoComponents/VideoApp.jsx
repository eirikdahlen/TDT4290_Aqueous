/* eslint-disable max-len */
// The App for the VideoWindow. This is where every video-component should go.

import React, { useState, useEffect } from 'react';
import BiasWidget from './BiasWidget';
import HeadingWidget from './HeadingWidget';
import DepthWidget from './DepthWidget';
import './css/VideoApp.css';
import VideoFeed from './VideoFeed';
import LockWidget from './LockWidget';

const { remote } = window.require('electron');

function VideoApp() {
  const [settingsValues, settingsUpdate] = useState(remote.getGlobal('toROV'));
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));
  const [biasValues, biasUpdate] = useState(remote.getGlobal('bias'));

  useEffect(() => {
    window.ipcRenderer.on('data-received', () => {
      settingsUpdate(remote.getGlobal('toROV'));
      sensorUpdate(remote.getGlobal('fromROV'));
      biasUpdate(remote.getGlobal('bias'));
    });
  }, []);

  return (
    <div className="VideoApp">
      <BiasWidget
        u={biasValues['surge']}
        v={biasValues['sway']}
        w={biasValues['heave']}
      />
      <HeadingWidget heading={sensorValues['yaw']} />
      <DepthWidget depth={sensorValues['down']} />
      <VideoFeed />
      <LockWidget
        id="LockWidgetHeading"
        value={0}
        isLocked={settingsValues['autoheading']}
      />
      <LockWidget
        id="LockWidgetDepth"
        value={200}
        isLocked={settingsValues['autodepth']}
      />
    </div>
  );
}

export default VideoApp;
