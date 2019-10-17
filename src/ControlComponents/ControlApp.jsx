// The App for the ControlWindow. This is where every control-components should go.
import React, { useState, useEffect } from 'react';
import Values from './Values';
import ManualMode from './ManualMode';
import NetfollowingMode from './NetFollowingMode';
import DynamicPositioningMode from './DynamicPositioningMode';
import './css/ControlApp.css';

const { remote } = window.require('electron');

function ControlApp() {
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));
  const [controlValues, controlUpdate] = useState(remote.getGlobal('toROV'));
  const [netfollowing, netfollowingUpdate] = useState(
    remote.getGlobal('netfollowing'),
  );
  const [mode, setMode] = useState(remote.getGlobal('mode'));

  useEffect(() => {
    window.ipcRenderer.on('data-received', () => {
      sensorUpdate(remote.getGlobal('fromROV'));
    });
  }, []);

  useEffect(() => {
    window.ipcRenderer.on('data-sent', () => {
      controlUpdate(remote.getGlobal('toROV'));
      setMode(remote.getGlobal('mode'));
      netfollowingUpdate(remote.getGlobal('netfollowing'));
    });
  }, []);

  return (
    <div className="ControlApp">
      <div className="controlFlex">
        <div className="topWindow">
          <ManualMode title="Manual Mode" toROV={controlValues}></ManualMode>
          <NetfollowingMode title="Net Following"></NetfollowingMode>
          <DynamicPositioningMode title="Dynamic Positioning"></DynamicPositioningMode>
        </div>
        <div className="bottomWindow">
          <div className="bottomLeft">
            <Values sensorValues={sensorValues} />
          </div>
          <div className="bottomRight">
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlApp;
