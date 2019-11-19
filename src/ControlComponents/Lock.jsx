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

// Component which handles Autoheading and autodepth locks
export default function Lock({
  title,
  active,
  currentValue,
  min,
  max,
  step,
  manualModeActive,
}) {
  const [reference, setReference] = useState(0.0);

  const type = { autoheading: 'yaw', autodepth: 'heave' }[title];
  const nameMapping = {
    autoheading: 'AUTO HEADING [°]',
    autodepth: 'AUTO DEPTH [m]',
  };

  // Normalizes or converts values to correct format and range
  // Wrapped in useCallback to be able to use it in a useEffect
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

  // Turn off lock if manualmode is switched off
  useEffect(() => {
    if (!manualModeActive) {
      remote.getGlobal('toROV')[title] = false;
      remote.getGlobal('toROV')[type] = 0.0;
    }
  }, [manualModeActive, title, type]);

  // Function that is run when the update-button is clicked - sets the local reference and updates global if active
  const updateValue = value => {
    setReference(value);
    if (active && manualModeActive) {
      remote.getGlobal('toROV')[type] = fixValue(value, true);
    }
  };

  // Function that is run when toggle is clicked - toggles the autoheading/depth
  const toggle = () => {
    if (manualModeActive) {
      remote.getGlobal('toROV')[title] = !remote.getGlobal('toROV')[title];
      remote.getGlobal('toROV')[type] = !active
        ? fixValue(reference, true)
        : 0.0;
    }
  };

  return (
    <div className="Lock">
      <Title small={true}>{nameMapping[title]}</Title>
      <div className="inputFlex">
        <ModeInput
          inputId={nameMapping[title]}
          min={min}
          max={max}
          step={step}
          clickFunction={updateValue}
          externalValue={active ? currentValue : reference}
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
  manualModeActive: PropTypes.bool,
  currentValue: PropTypes.number,
};
