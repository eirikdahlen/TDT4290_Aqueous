// The App for the ControlWindow. This is where every control-components should go.
import React, { useState, useEffect } from 'react';
import Values from './ControlComponents/js/Values';
import Map from './ControlComponents/js/Map';
import RollPitch from './ControlComponents/js/RollPitch';
import ModeMenu from './ControlComponents/js/ModeMenu';
import ControlBox from './ControlComponents/js/ControlBox';
import Status from './ControlComponents/js/Status';

import './ControlComponents/css/control.css';
import GamepadWrapper from './ControlComponents/GamepadWrapper';

function ControlApp() {
  const [sensorValues, sensorUpdate] = useState({
    north: 0.0,
    east: 0.0,
    down: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
  });

  useEffect(() => {
    window.ipcRenderer.on('data-received', (event, data) => {
      sensorUpdate(data);
    });
  }, []);

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
          <ControlBox name="AD" />
          <ControlBox name="AH" />
        </div>
      </div>
      <Values sensorValues={sensorValues} />
      {/*Should be values={props.values} 
      where props.values is passed from ViewManager?*/}
      <GamepadWrapper />
    </div>
  );
}

export default ControlApp;
