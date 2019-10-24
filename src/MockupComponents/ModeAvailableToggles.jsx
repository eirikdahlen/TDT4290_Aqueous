import React, { useState, useEffect } from 'react';

import './css/ModeAvailableToggles.css';

const { ipcRenderer } = require('electron');

export default function ModeAvailableToggles() {
  const [nfAvailable, setNfAvailable] = useState(true);
  const [dpAvailable, setDpAvailable] = useState(true);

  function toggleDPAvailable() {
    ipcRenderer.send('rov-mock-up-send-df-available', !dpAvailable);
    setDpAvailable(!dpAvailable);
  }

  function toggleNFAvailable() {
    ipcRenderer.send('rov-mock-up-send-nf-available', !nfAvailable);
    setNfAvailable(!nfAvailable);
  }

  useEffect(() => {
    // Update the document title using the browser API
    ipcRenderer.send('rov-mock-up-send-df-available', dpAvailable);
    ipcRenderer.send('rov-mock-up-send-nf-available', nfAvailable);
  }, []);

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
