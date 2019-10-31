import React, { useState, useEffect } from 'react';
import Values from './Values';
import ManualMode from './ManualMode';
import NetfollowingMode from './NetFollowingMode';
import DynamicPositioningMode from './DynamicPositioningMode';
import './css/ControlApp.css';

const { remote } = window.require('electron');

// The ControlApp is the main component for the controls-window
function ControlApp() {
  // Set the states to the global variables
  const [sensorValues, sensorUpdate] = useState(remote.getGlobal('fromROV'));
  const [controlValues, controlUpdate] = useState(remote.getGlobal('toROV'));
  const [mode, setMode] = useState(remote.getGlobal('mode'));
  const [IMCActive, setIMCActive] = useState(
    remote.getGlobal('settings').messageProtocol === 'IMC',
  );
  const [toROV, setToROV] = useState(controlValues); // Contains IMC or OLD data

  // make windows listen to ipc-msgs
  useEffect(() => {
    window.ipcRenderer.on('data-sent', () => {
      controlUpdate(remote.getGlobal('toROV'));
      setMode(remote.getGlobal('mode'));
      setToROV(
        IMCActive ? remote.getGlobal('toROVIMC') : remote.getGlobal('toROV'),
      );
    });
    window.ipcRenderer.on('data-received', () => {
      sensorUpdate(remote.getGlobal('fromROV'));
    });
    window.ipcRenderer.on('settings-updated', () => {
      setIMCActive(remote.getGlobal('settings').messageProtocol === 'IMC');
    });
  }, []);

  useEffect(() => {
    setToROV(
      IMCActive ? remote.getGlobal('toROVIMC') : remote.getGlobal('toROV'),
    );
  }, [IMCActive]);

  return (
    <div className="ControlApp">
      <div className="controlFlex">
        <div className="topWindow">
          <ManualMode
            title="Manual Mode"
            toROV={controlValues}
            modeData={mode}
          ></ManualMode>
          <NetfollowingMode
            title="Net Following"
            modeData={mode}
            step={0.05}
          ></NetfollowingMode>
          <DynamicPositioningMode
            title="Dynamic Positioning"
            modeData={mode}
            step={0.5}
          ></DynamicPositioningMode>
        </div>
        <div className="bottomWindow">
          <div className="bottomLeft">
            <Values
              title="sensor values"
              values={sensorValues}
              changeEffect={false}
            />
          </div>
          <div className="bottomRight">
            <Values
              IMCActive={IMCActive}
              title="Sent to ROV"
              values={toROV}
              changeEffect={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlApp;
