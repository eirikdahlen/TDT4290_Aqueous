import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Title from './Title';
import Switch from './Switch';
import './css/Lock.css';

const { remote } = window.require('electron');

export default function Lock({ title, active, value, min, max, step }) {
  const [input, changeInput] = useState(0.0);
  const [reference, setReference] = useState(0.0);
  const type = { autoheading: 'yaw', autodepth: 'heave' }[title];
  const unit = type === 'yaw' ? '°' : ' m';

  const fixValue = (value, toRadians) => {
    switch (title) {
      case 'autoheading': {
        if (toRadians) {
          return Number(value) * (Math.PI / 180);
        } else {
          let degrees = (Number(value) * (180 / Math.PI)) % 360;
          while (degrees < 0) {
            degrees += 360;
          }
          return degrees;
        }
      }
      case 'autodepth': {
        // Lets depth be max 200 and min 0
        value = Math.min(value, max);
        value = Math.max(value, min);
        return value;
      }
      default: {
        console.log('Unrecognized title');
      }
    }
  };

  // Function that is run when the update-button is clicked
  const updateValue = value => {
    setReference(value);
    if (active) {
      remote.getGlobal('toROV')[type] = fixValue(value, true);
    }
  };

  // Function that is run when toggle is clicked
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
          placeholder="0,0"
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
