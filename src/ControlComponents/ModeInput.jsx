import React from 'react';
import PropTypes from 'prop-types';
import './css/ModeInput.css';

// Component for the inputs used in the different modes. Contains a header, a input field and a button
// It uses the prop clickFunction to set the state of its parent to the input-value
export default function ModeInput({
  min,
  max,
  step,
  clickFunction,
  header,
  inputId,
}) {
  const inputElement = document.getElementById(inputId);
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
          onClick={() => {
            inputElement.select();
          }}
        />
        <button
          className="updateButton"
          onClick={
            header
              ? () =>
                  clickFunction(
                    Number(inputElement.value),
                    header.toLowerCase(),
                  )
              : () => clickFunction(Number(inputElement.value))
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
  inputId: PropTypes.string,
};
