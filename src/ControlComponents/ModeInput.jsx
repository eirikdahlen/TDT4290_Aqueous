import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './css/ModeInput.css';

// Component for the inputs used in the different modes. Contains a header, a input field and a button
// It uses the prop clickFunction to set the state of its parent to the input-value
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
          &#10003;
        </button>
      </div>
    </div>
  );
}

ModeInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  clickFunction: PropTypes.func,
  header: PropTypes.string,
};
