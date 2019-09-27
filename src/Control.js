// The App for the ControlWindow. This is where every control-components should go.
import React, { useState, useEffect } from 'react';
import Values from './ControlComponents/js/Values';
import Map from './ControlComponents/js/Map';
import RollPitch from './ControlComponents/js/RollPitch';
import ModeMenu from './ControlComponents/js/ModeMenu';
import Status from './ControlComponents/js/Status';
import Lock from './ControlComponents/js/Lock';

import './ControlComponents/css/control.css';
import GamepadWrapper from './ControlComponents/GamepadWrapper';

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
      <div className="topWindows">
        <Map />
        <RollPitch />
        <Status />
      </div>
      <div className="controlFlex">
        <ModeMenu mode="Manual" /> {/*Start in mode Manual*/}
        <div className="autoFlex">
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
      <Values sensorValues={sensorValues} />
      <GamepadWrapper />
    </div>
  );
}

export default ControlApp;
