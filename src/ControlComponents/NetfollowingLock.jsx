import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from './Switch';
import Title from './Title';
import './css/NetfollowingLock.css';

const { remote } = window.require('electron');

export default function Lock({ title, active, step }) {
  const [input, changeInput] = useState(0.0);

  function fixValue(value, type) {
    if (type === 'velocity') {
      value = Math.min(value, 10);
      value = Math.max(value, -10);
    } else {
      value = Math.min(value, 10);
      value = Math.max(value, 0);
    }
    return value;
  }

  // Function that is run when the update-button is clicked
  const updateValue = (value, type) => {
    if (active) {
      if (type === 'velocity') {
        remote.getGlobal('netfollowing')['velocity'] = fixValue(value, type);
      } else if (type === 'distance') {
        remote.getGlobal('netfollowing')['distance'] = fixValue(value, type);
      } else {
        console.log('Type not recognized');
      }
    }
  };

  // Function that is run when toggle is clicked
  const toggle = () => {
    remote.getGlobal('netfollowing')['active'] = !active;
  };

  return (
    <div className="NetfollowingLock">
      <Title>{title}</Title>
      <div className="inputFlexNF">
        <div className="firstRow">
          <input
            type="number"
            placeholder="Velocity"
            step={step}
            min={-10}
            max={10}
            onChange={e => changeInput(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(input, 'velocity')}
          >
            &#x21bb;
          </button>
        </div>
        <div className="secondRow">
          <input
            type="number"
            placeholder="Distance"
            step={step}
            min={0}
            max={10}
            onChange={e => changeInput(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(input, 'distance')}
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
