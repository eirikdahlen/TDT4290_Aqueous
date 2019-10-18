import React from 'react';
import './css/Switch.css';
import PropTypes from 'prop-types';

const Switch = ({ isOn, handleToggle, id, currentValue }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="switch-checkbox"
        id={id}
        type="checkbox"
      />
      <label
        className={'switch-label ' + (isOn ? 'activated-switch' : '')}
        htmlFor={id}
      >
        <span className="switch-button"></span>
      </label>
    </>
  );
};

Switch.propTypes = {
  isOn: PropTypes.bool,
  handleToggle: PropTypes.func,
  id: PropTypes.string,
  currentValue: PropTypes.string,
};

export default Switch;
