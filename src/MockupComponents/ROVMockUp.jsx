import React, { useState, useEffect } from 'react';
import modeEnum from '../constants/modeEnum';
import ModeAvailableToggles from './ModeAvailableToggles';
import FromROV from './FromROV';
import NFView from './NFView';
import Values from './../ControlComponents/Values';

import './css/ROVMockUp.css';

const { ipcRenderer } = require('electron');

export default function ROVMockUp() {
  const [mode, setMode] = useState(modeEnum.MANUAL);
  const [recievedData, setRecievedData] = useState(null);
  const [isServerRunning, setIsServerRunning] = useState(false);

  // TODO: add this functionality in TCPServerMockUp
  function startServer() {
    if (!isServerRunning) {
      ipcRenderer.send('startROVMockupServer');
      setIsServerRunning(true);
    }
  }

  function modeToName(mode) {
    switch (mode) {
      case 0:
        return 'MANUAL';
      case 1:
        return 'DYNAMIC POSITIONING';
      case 2:
        return 'NET FOLLOWING';
      default:
        break;
    }
  }

  useEffect(() => {
    window.ipcRenderer.on('rov-mock-up-send-mode', (event, arg) => {
      setMode(arg);
    });
    window.ipcRenderer.on('rov-mock-up-send-data', (event, arg) => {
      setRecievedData(arg);
    });
  }, []);

  return (
    <div className="mockupBox" style={{ backgroundColor: 'white' }}>
      <div className="startServer" onClick={() => startServer()}>
        {!isServerRunning ? 'Start Server' : 'Server is running...'}
      </div>
      <div className="mode">Mode: {modeToName(mode)}</div>
      <FromROV />
      <ModeAvailableToggles />
      <NFView />
      <div>
        <Values
          IMCActive={true}
          title="From GUI"
          values={recievedData ? recievedData : {}}
          changeEffect={false}
        />
        <div className="recievedData">
          Revieced data
          {recievedData ? (
            <div>
              <pre>{JSON.stringify(recievedData, null, 2)}</pre>
            </div>
          ) : (
            <div>No data recieved</div>
          )}
        </div>
      </div>
    </div>
  );
}
