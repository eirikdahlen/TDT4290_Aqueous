import React, { useState, useEffect } from 'react';
import { customNetFollowStateMetadata } from '../constants/imcMetadata';

import './css/NFView.css';

export default function NFView() {
  const [customNfStateMessage, setcustomNfStateMessage] = useState([]);

  useEffect(() => {
    setcustomNfStateMessage(new Array(3).fill(0));
  }, []);

  function changeCustomNfState(value, index) {
    let tempState = customNfStateMessage;
    tempState[index] = parseInt(value);
    console.log(tempState);
    setcustomNfStateMessage(tempState);
  }

  return (
    <div className="NFViewRoot">
      <div className="customNfState">
        <h3>Custom NF state</h3>
        <div className="settings">
          {customNetFollowStateMetadata.message.map((value, index) => {
            return (
              <div className="stateSlot" key={`customNfStateSlot${value.name}`}>
                <h3>{value.name}</h3>
                <input
                  className={`customNfStateInput${value.name}`}
                  onChange={e => changeCustomNfState(e.target.value, index)}
                ></input>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
