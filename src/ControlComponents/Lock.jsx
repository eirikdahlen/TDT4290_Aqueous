import React, { useState, useEffect, useCallback } from 'react';
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
  min,
  max,
  step,
  manualModeActive,
}) {
  const [reference, setReference] = useState(0.0);

  const type = { autoheading: 'yaw', autodepth: 'heave' }[title];
  const nameMapping = {
    autoheading: 'AH',
    autodepth: 'AD',
  };

  // Normalizes or converts values to correct format and range
  // Wrapped in useCallback to be able to use it in a useEffect
  const fixValue = useCallback(
    (value, toRadians) => {
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
    },
    [title, max, min],
  );

  // When manualModeActive (true if manual mode is active) changes, the global lock state is updates to match the Lock-components
  useEffect(() => {
    if (manualModeActive) {
      remote.getGlobal('toROV')[title] = active;
      if (active) {
        remote.getGlobal('toROV')[type] = fixValue(reference, true);
      }
    } else {
      remote.getGlobal('toROV')[title] = false;
      remote.getGlobal('toROV')[type] = 0.0;
    }
  }, [manualModeActive, reference, title, type, min, max, active, fixValue]);

  // Function that is run when the update-button is clicked - sets the local reference
  const updateValue = value => {
    setReference(value);
    if (active && manualModeActive) {
      remote.getGlobal('toROV')[type] = fixValue(reference, true);
    }
  };

  // Function that is run when toggle is clicked - toggles the localActive-state
  const toggle = () => {
    remote.getGlobal('toROV')[title] = !remote.getGlobal('toROV')[title];
    if (manualModeActive) {
      if (!active) {
        remote.getGlobal('toROV')[type] = fixValue(reference, true);
      } else {
        remote.getGlobal('toROV')[type] = 0.0;
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
};
