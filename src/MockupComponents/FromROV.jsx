import React, { useState } from 'react';
import { estimatedStateMetadata } from '../constants/imcMetadata';

import './css/FromROV.css';

const { ipcRenderer } = require('electron');

export default function FromROV() {
  const [estimatedStateMessage, setEstimatedStateMessage] = useState({
    lat: 0,
    lon: 0,
    height: 0,
    x: 0,
    y: 0,
    z: 0,
    phi: 0,
    theta: 0,
    psi: 0,
    u: 0,
    v: 0,
    w: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    p: 0,
    q: 0,
    r: 0,
    depth: 0,
    alt: 0,
  });

  function changeEstimatedState(value, name) {
    let tempState = estimatedStateMessage;
    tempState[name] = parseInt(value);
    console.log(tempState);
    setEstimatedStateMessage(tempState);
    ipcRenderer.send('estimatedState', estimatedStateMessage);
  }

  return (
    <div className="fromROV">
      <div className="estimatedStateSettings">
        <h3>Estimated state</h3>
        <div className="settings">
          {estimatedStateMetadata.message.map(value => {
            return (
              <div
                className="stateSlot"
                key={`estimatedStateSlot${value.name}`}
              >
                <h3>{value.name}</h3>
                <input
                  className={`estimatedStateInput${value.name}`}
                  onChange={e =>
                    changeEstimatedState(e.target.value, value.name)
                  }
                  placeholder={`${estimatedStateMessage[value.name]}`}
                ></input>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
