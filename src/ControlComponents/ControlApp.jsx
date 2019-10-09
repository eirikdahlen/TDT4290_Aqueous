// The App for the ControlWindow. This is where every control-components should go.
import React, { useState, useEffect } from 'react';
import Values from './Values';
import Map from './Map';
import RollPitch from './RollPitch';
import ModeMenu from './ModeMenu';
import Status from './Status';
import Lock from './Lock';

import './css/ControlApp.css';
import GamepadWrapper from './GamepadWrapper';
import KeyboardInput from './KeyboardInput';

const { remote } = window.require('electron');

function ControlApp() {
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));

  useEffect(() => {
    window.ipcRenderer.on('data-received', () => {
      sensorUpdate(remote.getGlobal('fromROV'));
    });
  }, []);

  let toROV = remote.getGlobal('toROV');

  return (
    <div className="ControlApp">
      <div className="controlFlex">
        <div className="topWindow">
          <Map />
          <RollPitch />
          <Status />
        </div>
        <div className="middleWindow">
          <ModeMenu mode="Manual" /> {/*Start in mode Manual*/}
          <div className="lockFlex">
            <Lock
              title="AutoDepth"
              active={toROV.autodepth}
              value={toROV.heave}
              min={0}
              max={200}
              step={0.1}
            />
            <Lock
              title="AutoHeading"
              active={toROV.autoheading}
              value={toROV.yaw}
              min={0}
              max={360}
              step={0.5}
              loop={true}
            />
          </div>
        </div>
        <div className="bottomWindow">
          <Values sensorValues={sensorValues} />
        </div>
      </div>
        <GamepadWrapper className="GamepadWrapper" />
      <div>
        <KeyboardInput  className="KeyboardInput"/>
      </div>
    </div>
  );
}

export default ControlApp;
