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
  const [toIMC, setToIMC] = useState(remote.getGlobal('toROVIMC'));
  const [fromIMC, setFromIMC] = useState(remote.getGlobal('fromROVIMC'));
  const [settings, setSettings] = useState(remote.getGlobal('settings'));
  const [NFValues, setNFValues] = useState(remote.getGlobal('netfollowing'));
  const [DPValues, setDPValues] = useState(
    remote.getGlobal('dynamicpositioning'),
  );

  // make windows listen to ipc-msgs
  useEffect(() => {
    let interval = setInterval(() => {
      setToIMC(remote.getGlobal('toROVIMC'));
      setFromIMC(remote.getGlobal('fromROVIMC'));
      controlUpdate(remote.getGlobal('toROV'));
      sensorUpdate(remote.getGlobal('fromROV'));
      setMode(remote.getGlobal('mode'));
      setNFValues(remote.getGlobal('netfollowing'));
      setDPValues(remote.getGlobal('dynamicpositioning'));
    }, 300);
    window.ipcRenderer.on('settings-updated', () => {
      const currentSettings = remote.getGlobal('settings');
      setIMCActive(currentSettings.messageProtocol === 'IMC');
      setSettings({ ...currentSettings });
    });
    return () => {
      clearInterval(interval);
    };
  }, []);

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
            values={NFValues}
          ></NetfollowingMode>
          <DynamicPositioningMode
            title="Dynamic Positioning"
            modeData={mode}
            step={0.1}
            fromROV={sensorValues}
            values={DPValues}
          ></DynamicPositioningMode>
        </div>
        <div className="bottomWindow">
          <div className="bottomLeft">
            <Values
              title="MESSAGES RECEIVED"
              values={IMCActive ? fromIMC : sensorValues}
              changeEffect={false}
              IMCActive={IMCActive}
            />
          </div>
          <div className="bottomRight">
            <Values
              IMCActive={IMCActive}
              title="MESSAGES SENT"
              values={IMCActive ? toIMC : controlValues}
              changeEffect={true}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlApp;
