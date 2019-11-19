import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './css/ModeInput.css';
import { roundNumber } from '../utils/utils';

// Component for the inputs used in the different modes. Contains a header, a input field and a button
// It uses the prop clickFunction to set the state of its parent to the input-value
export default function ModeInput({
  min,
  max,
  step,
  clickFunction,
  header,
  inputId,
  externalValue,
}) {
  const [inputField, setInputField] = useState(undefined);
  const [currentValue, setCurrentValue] = useState(externalValue);

  useEffect(() => {
    setInputField(document.getElementById(inputId));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!inputField) {
      return;
    }
    if (externalValue !== currentValue) {
      setCurrentValue(externalValue);
      inputField.value = roundNumber(externalValue);
    }
    // eslint-disable-next-line
  }, [externalValue]);

  // Handles button click by sending value to parent
  const handleClick = () => {
    const inputVal = Number(inputField.value);
    const prettyValue = roundNumber(inputVal);
    inputField.value = prettyValue;
    if (header) {
      header = header.split(' ')[0].toLowerCase(); // Removes unit from type
    }
    setCurrentValue(inputVal);
    clickFunction(inputVal, header);
  };

  return (
    <div className="ModeInput">
      {header ? <h3>{header}</h3> : ''}
      <div className="inputs">
        <input
          id={inputId}
          type="number"
          placeholder="0.0"
          step={step}
          min={min}
          max={max}
          onClick={event => {
            event.target.select();
          }}
        />
        <button className="updateButton" onClick={() => handleClick()}>
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
  inputId: PropTypes.string,
  externalValue: PropTypes.number,
};
