// The App for the VideoWindow. This is where every video-component should go.

import React, { useState, useEffect } from 'react';
import BiasWidget from './BiasWidget';
import HeadingWidget from './HeadingWidget';
import DepthWidget from './DepthWidget';
import './css/VideoApp.css';
import VideoFeed from './VideoFeed';
import ModeWidget from './ModeWidget';
import MiniMapWidget from './MiniMapWidget';
import GamepadWrapper from './GamepadWrapper';
import KeyboardWrapper from './KeyboardWrapper';
import MenuButton from './MenuButton';
import VideoPicker from './VideoPicker';

const { remote } = window.require('electron');

function VideoApp() {
  const [settingsValues, settingsUpdate] = useState(remote.getGlobal('toROV'));
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));
  const [biasValues, biasUpdate] = useState(remote.getGlobal('bias'));
  const [transparent, toggleTransparent] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  const closeVideoWindow = () => {
    let w = remote.getCurrentWindow();
    w.close();
  };

  const maximizeVideoWindow = () => {
    let w = remote.getCurrentWindow();
    w.maximize();
  };

  const minimizeVideoWindow = () => {
    let w = remote.getCurrentWindow();
    w.minimize();
  };

  useEffect(() => {
    window.ipcRenderer.on('data-received', () => {
      settingsUpdate(remote.getGlobal('toROV'));
      sensorUpdate(remote.getGlobal('fromROV'));
      biasUpdate(remote.getGlobal('bias'));
    });
  }, []);

  return (
    <div className={transparent ? 'transparentVideoApp' : 'VideoApp'}>
      <div className="videoMenu">
        <MenuButton
          clickFunction={() => toggleTransparent(!transparent)}
          image="transparent"
          additionalClass="transparentBtn"
        />
        <VideoPicker
          deviceId={deviceId}
          handleClick={id => setDeviceId(id)}
          hidden={transparent}
        />
        <MenuButton
          clickFunction={() => {
            minimizeVideoWindow();
          }}
          image="minimize"
          additionalClass="minimizeBtn"
        ></MenuButton>
        <MenuButton
          clickFunction={() => {
            maximizeVideoWindow();
          }}
          image="maximize"
          additionalClass="maximizeBtn"
        ></MenuButton>
        <MenuButton
          clickFunction={() => {
            closeVideoWindow();
          }}
          image="close"
          additionalClass="closeBtn"
        ></MenuButton>
      </div>
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
      <ModeWidget
        currentMode={remote.getGlobal('mode')['currentMode']}
        nfAvailable={remote.getGlobal('mode')['nfAvailable']}
      />
      <MiniMapWidget
        north={sensorValues['north']}
        east={sensorValues['east']}
        yaw={sensorValues['yaw']}
        boatHeading={0}
        maxDistance={5}
      />
      <GamepadWrapper className="GamepadWrapper" />
      <KeyboardWrapper className="KeyboardInput" />
      <VideoFeed deviceId={deviceId} hidden={transparent} />
    </div>
  );
}

export default VideoApp;
