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
import VideoMenu from './VideoMenu';
import AvailabilityWidget from './AvailabilityWidget';
import ModeEnum from '../constants/modeEnum';

const { remote } = window.require('electron');

function VideoApp() {
  const [settingsValues, settingsUpdate] = useState(remote.getGlobal('toROV'));
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));
  const [biasValues, biasUpdate] = useState(remote.getGlobal('bias'));
  const [transparent, toggleTransparent] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    let interval = setInterval(() => {
      settingsUpdate(remote.getGlobal('toROV'));
      sensorUpdate(remote.getGlobal('fromROV'));
      biasUpdate(remote.getGlobal('bias'));
    }, 300);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const mode = remote.getGlobal('mode').currentMode;
  var depth;
  var yaw;

  if (mode === ModeEnum.MANUAL) {
    depth = parseFloat(settingsValues['heave']).toFixed(2);
    yaw = parseFloat(settingsValues['yaw']);
  } else if (mode === ModeEnum.NETFOLLOWING) {
    depth = parseFloat(remote.getGlobal('netfollowing')['depth']).toFixed(2);
  } else if (mode === ModeEnum.DYNAMICPOSITIONING) {
    yaw = parseFloat(remote.getGlobal('dynamicpositioning')['yaw']);
    depth = parseFloat(remote.getGlobal('dynamicpositioning')['down']).toFixed(
      2,
    );
  } else {
    depth = 0;
  }

  return (
    <div className={transparent ? 'transparentVideoApp' : 'VideoApp'}>
      <VideoMenu
        toggleTransparent={toggleTransparent}
        transparent={transparent}
        deviceId={deviceId}
        setDeviceId={setDeviceId}
      />
      <BiasWidget
        u={biasValues['surge']}
        v={biasValues['sway']}
        w={biasValues['heave']}
      />
      <HeadingWidget
        heading={sensorValues['yaw']}
        isLocked={
          settingsValues['autoheading'] || mode === ModeEnum.DYNAMICPOSITIONING
        }
        lockedValue={yaw}
      />
      <DepthWidget
        depth={sensorValues['down']}
        isLocked={settingsValues['autodepth'] || mode !== ModeEnum.MANUAL}
        lockedValue={depth}
      />
      <AvailabilityWidget
        nfAvailable={remote.getGlobal('mode')['nfAvailable']}
        dpAvailable={remote.getGlobal('mode')['dpAvailable']}
      />
      <ModeWidget
        currentMode={remote.getGlobal('mode')['currentMode']}
        nfAvailable={remote.getGlobal('mode')['nfAvailable']}
      />
      <MiniMapWidget
        north={sensorValues['north']}
        east={sensorValues['east']}
        yaw={sensorValues['yaw']}
        boatHeading={
          remote.getGlobal('settings')['useManualHeading']
            ? remote.getGlobal('settings')['manualBoatHeading']
            : remote.getGlobal('boat')['heading']
        }
        maxDistance={20}
        mapRotation={remote.getGlobal('settings')['mapRotation']}
      />
      <GamepadWrapper className="GamepadWrapper" />
      <KeyboardWrapper className="KeyboardInput" />
      <VideoFeed deviceId={deviceId} hidden={transparent} />
    </div>
  );
}

export default VideoApp;
