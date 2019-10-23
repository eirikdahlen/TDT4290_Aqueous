import React, { useState } from 'react';
import ModeEnum from '../constants/modeEnum';

import './css/ModeAvailableToggles.css';

const { ipcRenderer } = require('electron');

const states = ModeEnum;
const entityState = {
  state: states.MANUAL,
  flags: {
    DP: true,
    NF: true,
  },
};

export default function ModeAvailableToggles() {
  const [nfAvailable, changeNfAvailable] = useState(true);
  const [dpAvailable, changeDpAvailable] = useState(true);
  const [entityStateMessage, changeEntityStateMessage] = useState(entityState);

  function toggleDPAvailable() {
    let tempAvail = !dpAvailable;
    changeDpAvailable(tempAvail);
    changeEntityStateMessage({
      state: states.MANUAL,
      flags: {
        DP: tempAvail,
        NF: nfAvailable,
      },
    });
    // Send IMC Message here
    ipcRenderer.send('entityState', entityStateMessage);
  }

  function toggleNFAvailable() {
    let tempAvail = !nfAvailable;
    changeNfAvailable(!nfAvailable);
    changeEntityStateMessage({
      state: states.MANUAL,
      flags: {
        DP: dpAvailable,
        NF: tempAvail,
      },
    });
    // Send IMC Message here
  }

  return (
    <div className="modeToggles">
      <div className="nfAvailToggle">
        <h3>NF available toggle</h3>
        <div className="toggleSwitch" onClick={() => toggleNFAvailable()}>
          Active: {`${nfAvailable}`}
        </div>
      </div>
      <div className="dpAvailToggle">
        <h3>DP available toggle</h3>
        <div className="toggleSwitch" onClick={() => toggleDPAvailable()}>
          Active: {`${dpAvailable}`}
        </div>
      </div>
    </div>
  );
}
