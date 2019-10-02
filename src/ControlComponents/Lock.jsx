import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Title from './Title';
import Switch from './Switch';
import './css/Lock.css';

const { remote } = window.require('electron');

export default function Lock({ title, active, value, min, max, step, loop }) {
  const [input, changeInput] = useState(0.0);
  const [reference, setReference] = useState(0.0);
  const type = { autoheading: 'yaw', autodepth: 'heave' }[title];

  const updateValue = value => {
    setReference(value);
    if (active) {
      remote.getGlobal('toROV')[type] = Number(value);
    }
  };

  const toggle = () => {
    remote.getGlobal('toROV')[title] = !active;
    remote.getGlobal('toROV')[type] = active ? 0.0 : Number(reference);
  };

  return (
    <div className="Lock">
      <Title>{title}</Title>
      <div className="inputFlex">
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          onChange={e => changeInput(Number(e.target.value))}
        />
        <button className="updateButton" onClick={() => updateValue(input)}>
          &#x21bb;
        </button>
      </div>
      <div className="check">
        <Switch
          isOn={active}
          handleToggle={() => {
            toggle();
          }}
          id={`${title}Switch`}
          currentValue={value}
        />
      </div>
    </div>
  );
}

Lock.propTypes = {
  title: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  loop: PropTypes.bool,
  step: PropTypes.number,
  active: PropTypes.bool,
  value: PropTypes.number,
};
