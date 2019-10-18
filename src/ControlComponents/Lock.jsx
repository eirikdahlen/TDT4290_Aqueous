import React, { useState, useEffect } from 'react';
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

export default function Lock({
  title,
  active,
  value,
  min,
  max,
  step,
  manualModeActive,
}) {
  const [reference, setReference] = useState(0.0);
  const [localActive, setLocalActive] = useState(active);

  const type = { autoheading: 'yaw', autodepth: 'heave' }[title];
  const nameMapping = {
    autoheading: 'AH',
    autodepth: 'AD',
  };

  useEffect(() => {
    if (manualModeActive) {
      remote.getGlobal('toROV')[title] = localActive;
      if (localActive) {
        remote.getGlobal('toROV')[type] = fixValue(reference, true);
      }
    } else {
      remote.getGlobal('toROV')[title] = false;
      remote.getGlobal('toROV')[type] = 0.0;
    }
  }, [manualModeActive, reference, localActive]);

  // Function that is run when the update-button is clicked
  const updateValue = value => {
    setReference(value);
  };

  // Function that is run when toggle is clicked
  const toggle = () => {
    setLocalActive(!localActive);
  };

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

  return (
    <div className="Lock">
      <Title small={true}>{nameMapping[title]}</Title>
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
          isOn={localActive}
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
