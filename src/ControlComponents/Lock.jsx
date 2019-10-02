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
  const unit = type === 'yaw' ? '°' : ' m';

  const fixValue = (value, toRadians) => {
    if (title === 'autoheading') {
      if (toRadians) {
        return (Number(value) * (Math.PI / 180)) % (2 * Math.PI);
      } else {
        return (Number(value) * (180 / Math.PI)) % 360;
      }
    } else {
      if (value > 200) {
        return 200;
      } else if (value < 0) {
        return 0.0;
      }
      return value;
    }
  };

  const updateValue = value => {
    setReference(value);
    if (active) {
      remote.getGlobal('toROV')[type] = fixValue(value, true);
    }
  };

  const toggle = () => {
    remote.getGlobal('toROV')[title] = !active;
    remote.getGlobal('toROV')[type] = active ? 0.0 : fixValue(reference, true);
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
          currentValue={`${fixValue(value, false).toFixed(1)}${unit}`}
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
