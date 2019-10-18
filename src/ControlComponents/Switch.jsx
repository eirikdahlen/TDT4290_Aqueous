import React from 'react';
import './css/Switch.css';
import PropTypes from 'prop-types';

// Component for the switch used in locks and modes
const Switch = ({ isOn, handleToggle, id }) => {
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
};

export default Switch;
