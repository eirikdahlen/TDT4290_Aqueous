import React, { useState } from 'react';

import './css/ModeAvailableToggles.css';

export default function ModeAvailableToggles() {
  const [nfAvailable, changeNfAvailable] = useState(false);
  const [dpAvailable, changeDpAvailable] = useState(false);

  function toggleDPAvailable() {
    changeDpAvailable(!dpAvailable);
    // Send IMC Message here
  }

  function toggleNFAvailable() {
    changeNfAvailable(!nfAvailable);
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
