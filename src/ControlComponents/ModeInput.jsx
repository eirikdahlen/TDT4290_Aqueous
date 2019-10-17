import React, { useState } from 'react';
import './css/ModeInput.css';

export default function ModeInput({ min, max, step, clickFunction, header }) {
  const [input, changeInput] = useState(0.0);
  return (
    <div className="ModeInput">
      {header ? <h3>{header}</h3> : ''}
      <div className="inputs">
        <input
          type="number"
          placeholder="0.0"
          step={step}
          min={min}
          max={max}
          onChange={e => changeInput(Number(e.target.value))}
        />
        <button
          className="updateButton"
          onClick={
            header
              ? () => clickFunction(input, header.toLowerCase())
              : () => clickFunction(input)
          }
        >
          &#x21bb;
        </button>
      </div>
    </div>
  );
}
