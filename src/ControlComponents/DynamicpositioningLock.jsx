import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from './Switch';
import Title from './Title';
import './css/NetfollowingLock.css';

const { remote } = window.require('electron');

export default function DynamicpositioningLock({ title, active, step }) {
  const [input, changeInput] = useState(0.0);
  const [velocityValue, setVelocityValue] = useState(0.0);
  const [distanceValue, setDistanceValue] = useState(0.0);

  function fixValue(value, type) {
    if (type === 'setting1') {
      value = Math.min(value, 10);
      value = Math.max(value, -10);
      setVelocityValue(value);
    } else {
      value = Math.min(value, 10);
      value = Math.max(value, 0);
      setDistanceValue(value);
    }
    return value;
  }

  // Function that is run when the update-button is clicked
  // Placeholder settings for now (setting1 and setting2)
  const updateValue = (value, type) => {
    // Could remove this "if" to set value before activating the switch
    if (active) {
      if (type === 'setting1') {
        remote.getGlobal('dynamicpositioning')['setting1'] = fixValue(value, type);
      } else if (type === 'setting2') {
        remote.getGlobal('dynamicpositioning')['setting2'] = fixValue(value, type);
      } else {
        console.log('Type not recognized');
      }
    }
  };

  // Function that is run when toggle is clicked
  const toggle = () => {
    remote.getGlobal('dynamicpositioning')['active'] = !active;
  };

  return (
    <div className="NetfollowingLock">
      <Title>{title}</Title>
      <div className="inputFlexNF">
        <h3>setting1</h3>
        <div className="firstRow">
          <input
            type="number"
            placeholder="Setting1"
            step={step}
            min={-10}
            max={10}
            onChange={e => changeInput(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(input, 'setting1')}
          >
            &#x21bb;
          </button>
        </div>
        <h3>setting2</h3>
        <div className="secondRow">
          <input
            type="number"
            placeholder="setting2"
            step={step}
            min={0}
            max={10}
            onChange={e => changeInput(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(input, 'setting2')}
          >
            &#x21bb;
          </button>
        </div>
      </div>
      <div className="checkSwitch">
        <Switch
          isOn={active}
          handleToggle={() => {
            toggle();
          }}
          id={`${title}Switch`}
          currentValue={`v: ${velocityValue.toFixed(
            1,
          )}m/s   d: ${distanceValue.toFixed(1)}m`}
        />
      </div>
    </div>
  );
}

DynamicpositioningLock.propTypes = {
  title: PropTypes.string,
  step: PropTypes.number,
  active: PropTypes.bool,
};
