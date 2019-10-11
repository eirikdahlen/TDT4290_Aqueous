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
        style={{ background: isOn && '#158f36' }}
        className="switch-label"
        htmlFor={id}
      >
        <span className="currentValue">{isOn ? currentValue : ''}</span>
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
