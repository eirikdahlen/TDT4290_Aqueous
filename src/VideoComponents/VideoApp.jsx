/* eslint-disable max-len */
// The App for the VideoWindow. This is where every video-component should go.

import React, { useState, useEffect } from 'react';
import BiasWidget from './BiasWidget';
import HeadingWidget from './HeadingWidget';
import DepthWidget from './DepthWidget';
import './css/VideoApp.css';
import VideoFeed from './VideoFeed';

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
      <HeadingWidget
        heading={sensorValues['yaw']}
        isLocked={settingsValues['autoheading']}
        lockedValue={settingsValues['yaw']}
      />
      <DepthWidget
        depth={sensorValues['down']}
        isLocked={settingsValues['autodepth']}
        lockedValue={settingsValues['heave']}
      />
      <VideoFeed />
    </div>
  );
}

export default VideoApp;
