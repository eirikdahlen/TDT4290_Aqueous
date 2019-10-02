import React from 'react';
import './css/Switch.css';

const Switch = ({ isOn, handleToggle, id, currentValue }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={id}
        type="checkbox"
      />
      <label
        style={{ background: isOn && '#4ac276' }}
        className="react-switch-label"
        htmlFor={id}
      >
        <span className="currentValue">{isOn ? currentValue : ''}</span>
        <span className={`react-switch-button`}></span>
      </label>
    </>
  );
};

export default Switch;
