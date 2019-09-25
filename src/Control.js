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

<<<<<<< HEAD
const { remote } = window.require('electron');

function ControlApp() {
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));

  useEffect(() => {
    window.ipcRenderer.on('data-received', () => {
      sensorUpdate(remote.getGlobal('fromROV'));
    });
  }, []);
=======
const remote = window.require('electron').remote;

function ControlApp() {
  const dummyValues = [2.11, 1.12, 20.89, 0.01, 0.0, 234.59];
  let toROV = remote.getGlobal('toROV');
>>>>>>> #39 #41 feature: Make lock component set toROV-values

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
<<<<<<< HEAD
      <Values sensorValues={sensorValues} />
      {/*Should be values={props.values} 
      where props.values is passed from ViewManager?*/}
=======
      <Values values={dummyValues} />
>>>>>>> #39 #41 feature: Make lock component set toROV-values
      <GamepadWrapper />
    </div>
  );
}

export default ControlApp;
