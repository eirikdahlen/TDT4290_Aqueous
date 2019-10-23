import React, { useState, useEffect } from 'react';
import modeEnum from '../constants/modeEnum';
import ModeAvailableToggles from './ModeAvailableToggles';
import FromROV from './FromROV';
import ManualView from './ManualView';
import DPView from './DPView';
import NFView from './NFView';

import './css/ROVMockUp.css';

const { ipcRenderer } = require('electron');

export default function ROVMockUp() {
  const [mode, setMode] = useState(modeEnum.MANUAL);
  const [manualView, setManualView] = useState(true);
  const [dpView, setDPView] = useState(false);
  const [nfView, setNFView] = useState(false);
  const [recievedData, setRecievedData] = useState(null);
  const [isServerRunning, setIsServerRunning] = useState(false);

  // TODO: add this functionality in TCPServerMockUp
  function startServer() {
    if (!isServerRunning) {
      console.log('hei');
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
      console.log(`Recieved data ${arg}`);
    });
    // window.ipcRenderer.on('rov-mock-up-send-data', (event, arg) => {
    //   setRecievedData(arg);
    //   // console.log(`Recieved data ${arg}`);
    // });
  }, []);

  /**
   * Liste med alle felter som skal settes
   * Vise både hva man får og hva man sender
   * Starte en funksjon som starter hele serveren
   * Slå av og på flagg med NF-avail osv
   * Tvinge GUI til å være i manual mode
   * I Manual:
   *    Tar inn input fra UI og setter alle variabler i estimatedStates
   * I NF:
   *    Forandre degree, distance og velocity
   *
   *
   */

  return (
    <div className="mockupBox" style={{ backgroundColor: 'white' }}>
      <div className="startServer" onClick={() => startServer()}>
        {!isServerRunning ? 'Start Server' : 'Server is running...'}
      </div>
      <div className="mode">Mode: {modeToName(mode)}</div>
      <FromROV />
      <ModeAvailableToggles />
      {manualView ? <ManualView /> : null}
      {dpView ? <DPView /> : null}
      {nfView ? <NFView /> : null}
      <div>Revieced data: {recievedData}</div>
    </div>
  );
}
