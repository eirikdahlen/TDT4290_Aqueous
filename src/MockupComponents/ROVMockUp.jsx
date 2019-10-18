import React, { useState } from 'react';

import './css/ROVMockUp.css';

export default function ROVMockUp() {
  const [mode, setMode] = useState('M');

  function changeMode(inputMode) {
    switch (inputMode) {
      case '':
        setMode('M');
        console.log('M');
        break;
      case 'M':
        setMode(inputMode);
        console.log('M');
        break;
      case 'DP':
        setMode(inputMode);
        console.log('DP');
        break;
      case 'NF':
        setMode(inputMode);
        console.log('NF');
        break;
      default:
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
      <div className="startServer" onClick={startServer()}>
        Start Server
      </div>
      <div className="modeInput">
        <input
          placeholder="Mode"
          onChange={e => changeMode(e.target.value.toUpperCase())}
        ></input>
      </div>
    </div>
  );
}
