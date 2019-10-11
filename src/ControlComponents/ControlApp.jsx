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
import KeyboardWrapper from './KeyboardWrapper';

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
          <Map />
          <RollPitch />
          <Status />
        </div>
        <div
          className="middleWindow"
          onClick={() => console.log({ netfollowing }, { mode })}
        >
          {/*Start in mode Manual*/}
          <ModeMenu
            globalMode={mode.globalMode} // TODO: This should be fetched from the ROV somehow
            netfollowingAvailable={mode.nfAvailable}
          />
          <div className="lockFlex">
            <Lock
              title="autodepth"
              active={controlValues.autodepth}
              value={controlValues.heave}
              min={0}
              max={200}
              step={0.1}
            />
            <Lock
              title="autoheading"
              active={controlValues.autoheading}
              value={controlValues.yaw}
              min={0}
              max={360}
              step={1}
            />
          </div>
        </div>
        <div className="bottomWindow">
          <Values sensorValues={sensorValues} />
        </div>
      </div>
      <GamepadWrapper className="GamepadWrapper" />
      <KeyboardWrapper className="KeyboardInput" />
    </div>
  );
}

export default ControlApp;
