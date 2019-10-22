import React, { useState, useEffect } from 'react';
import {
  estimatedStateMetadata,
  entityStateMetadata,
} from '../constants/imcMetadata';

import './css/FromROV.css';

export default function FromROV() {
  const [estimatedStateMessage, setEstimatedStateMessage] = useState([]);
  const [entityStateMessage, setEntityStateMessage] = useState([]);

  useEffect(() => {
    setEstimatedStateMessage(new Array(20).fill(0));
    setEntityStateMessage(new Array(3).fill(0));
  }, []);

  function changeEstimatedState(value, index) {
    let tempState = estimatedStateMessage;
    tempState[index] = parseInt(value);
    console.log(tempState);
    setEstimatedStateMessage(tempState);
  }

  function changeEntityState(value, index) {
    let tempState = entityStateMessage;
    tempState[index] = parseInt(value);
    console.log(tempState);
    setEntityStateMessage(tempState);
  }

  return (
    <div className="fromROV">
      <div className="estimatedStateSettings">
        <h3>Estimated state</h3>
        <div className="settings">
          {estimatedStateMetadata.message.map((value, index) => {
            return (
              <div
                className="stateSlot"
                key={`estimatedStateSlot${value.name}`}
              >
                <h3>{value.name}</h3>
                <input
                  className={`estimatedStateInput${value.name}`}
                  onChange={e => changeEstimatedState(e.target.value, index)}
                ></input>
              </div>
            );
          })}
        </div>
      </div>
      <div className="entityStateSettings">
        <h3>Entity state </h3>
        <div className="settings">
          {entityStateMetadata.message.map((value, index) => {
            return (
              <div className="stateSlot" key={`entityStateSlot${value.name}`}>
                <h3>{value.name}</h3>
                <input
                  type={`entityStateInput${value.name}`}
                  onChange={e => changeEntityState(e.target.value, index)}
                ></input>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
