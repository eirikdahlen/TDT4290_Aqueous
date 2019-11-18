import React, { useState } from 'react';
import { customNetFollowStateMetadata } from '../constants/imcMetadata';
import './css/NFView.css';
const { ipcRenderer } = require('electron');

export default function NFView() {
  const [customNfStateMessage, setcustomNfStateMessage] = useState({
    d: 0,
    v: 0,
    angle: 0,
  });

  function changeCustomNfState(value, name) {
    let tempState = customNfStateMessage;
    tempState[name] = isNaN(Number(value)) ? 0 : Number(value);
    console.log(tempState);
    setcustomNfStateMessage(tempState);
    ipcRenderer.send('rov-mock-up-send-custom-nf-state', tempState);
  }

  return (
    <div className="NFViewRoot">
      <div className="customNfState">
        <h3>Custom NF state</h3>
        <div className="settings">
          {customNetFollowStateMetadata.message.map(value => {
            return (
              <div className="stateSlot" key={`customNfStateSlot${value.name}`}>
                <h3>{value.name}</h3>
                <input
                  type="number"
                  className={`customNfStateInput${value.name}`}
                  onChange={e =>
                    changeCustomNfState(e.target.value, value.name)
                  }
                  placeholder={`${customNfStateMessage[value.name]}`}
                ></input>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
