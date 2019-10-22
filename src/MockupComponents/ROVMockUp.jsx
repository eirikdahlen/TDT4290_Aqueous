import React, { useState } from 'react';
import modeEnum from '../constants/modeEnum';
import ModeAvailableToggles from './ModeAvailableToggles';
import FromROV from './FromROV';
import ManualView from './ManualView';
import DPView from './DPView';
import NFView from './NFView';

import './css/ROVMockUp.css';

export default function ROVMockUp() {
  const [mode, setMode] = useState(modeEnum.MANUAL);
  const [manualView, setManualView] = useState(true);
  const [dpView, setDPView] = useState(false);
  const [nfView, setNFView] = useState(false);

  function changeMode(inputMode) {
    switch (inputMode) {
      case 'DP':
        setMode(modeEnum.DYNAMICPOSITIONING);
        setNFView(false);
        setManualView(false);
        setDPView(true);
        console.log('DP');
        break;
      case 'NF':
        setMode(modeEnum.NETFOLLOWING);
        setManualView(false);
        setDPView(false);
        setNFView(true);
        console.log('NF');
        break;
      default:
        setMode(modeEnum.MANUAL);
        setDPView(false);
        setNFView(false);
        setManualView(true);
        console.log('MANUAL');
        break;
    }
  }

  // TODO: add this functionality in TCPServerMockUp
  function startServer() {
    return null;
  }

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
        Start Server
      </div>
      <div className="modeInput">
        <input
          placeholder="Mode"
          type="modeInput"
          onChange={e => changeMode(e.target.value.toUpperCase())}
        ></input>
      </div>
      <FromROV />
      <ModeAvailableToggles />
      {manualView ? <ManualView /> : null}
      {dpView ? <DPView /> : null}
      {nfView ? <NFView /> : null}
    </div>
  );
}
