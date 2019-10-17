import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Title from './Title';
import Switch from './Switch';
import ModeInput from './ModeInput';
import './css/Lock.css';
import {
  degreesToRadians,
  radiansToDegrees,
  normalize,
} from './../utils/utils';

const { remote } = window.require('electron');

export default function Lock({ title, active, value, min, max, step }) {
  const [reference, setReference] = useState(0.0);
  const type = { autoheading: 'yaw', autodepth: 'heave' }[title];
  const unit = type === 'yaw' ? '°' : ' m';

  const fixValue = (value, toRadians) => {
    switch (title) {
      case 'autoheading': {
        if (toRadians) {
          return degreesToRadians(value);
        } else {
          return radiansToDegrees(value);
        }
      }
      case 'autodepth': {
        return normalize(value, min, max);
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
        <ModeInput
          min={min}
          max={max}
          step={step}
          clickFunction={updateValue}
        ></ModeInput>
      </div>
      <div className="check">
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
