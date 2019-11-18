import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Switch from './Switch';
import Title from './Title';
import './css/Mode.css';
import ModeEnum from '../constants/modeEnum';
import ModeInput from './ModeInput';
import { normalize, roundNumber } from './../utils/utils';
import { resetAllBias } from './../utils/IPCutils';

const { remote } = window.require('electron');

// Component for the net following mode, handles its values and toggling it on and off.
export default function NetfollowingMode({ title, modeData, step, values }) {
  // Active is set if the current global mode is NF, and available is set from the global state
  let active = modeData.currentMode === ModeEnum.NETFOLLOWING;
  let available = modeData.nfAvailable;

  // Sets input fields to the global values on mount
  useEffect(() => {
    updateInputFields();
  }, []);

  // Normalises a value to the correct ranges
  function fixValue(value, type) {
    if (type === 'velocity') {
      value = normalize(value, -3, 3);
    } else if (type === 'distance') {
      value = normalize(value, 0, 3);
    } else {
      value = normalize(value, 0, 200);
    }
    return value;
  }

  // Function that is run when the update-button is clicked, sets the global state to value
  const updateValue = (value, type) => {
    if (type === 'velocity') {
      remote.getGlobal('netfollowing')['velocity'] = fixValue(value, type);
    } else if (type === 'distance') {
      remote.getGlobal('netfollowing')['distance'] = fixValue(value, type);
    } else if (type === 'depth') {
      remote.getGlobal('netfollowing')['depth'] = fixValue(value, type);
    } else {
      console.log('Type not recognized');
    }
  };

  // Function that is run when toggle is clicked - toggles to NF if available and in different mode, toggle to manual if in NF
  const toggle = () => {
    if (!available) {
      return;
    }
    if (modeData.currentMode === ModeEnum.NETFOLLOWING) {
      remote.getGlobal('mode')['currentMode'] = ModeEnum.MANUAL;
    } else if (
      modeData.currentMode === ModeEnum.MANUAL ||
      modeData.currentMode === ModeEnum.DYNAMICPOSITIONING
    ) {
      remote.getGlobal('mode')['currentMode'] = ModeEnum.NETFOLLOWING;
      remote.getGlobal('netfollowing')['depth'] = remote.getGlobal('fromROV')[
        'down'
      ];
      resetAllBias();
    } else {
      console.log('Error - unable to change mode');
    }
  };

  // Sets input fields to the global values
  const updateInputFields = () => {
    ['velocity', 'distance', 'depth'].forEach(attribute => {
      const currentValue = remote.getGlobal('netfollowing')[attribute];
      const inputField = document.getElementById(attribute);
      inputField.value = roundNumber(currentValue);
    });
  };

  return (
    <div className={'Mode ' + (active ? 'activeMode' : '')}>
      <Title available={available}>{title.toUpperCase()}</Title>
      <div className="modeInputFlex">
        <ModeInput
          inputId={'velocity'}
          header={'Velocity [m/s]'}
          min={-10}
          max={10}
          step={step}
          clickFunction={updateValue}
          externalValue={values.velocity}
        ></ModeInput>
        <ModeInput
          inputId={'distance'}
          header={'Distance [m]'}
          min={0}
          max={10}
          step={step}
          clickFunction={updateValue}
          externalValue={values.distance}
        ></ModeInput>
        <ModeInput
          inputId={'depth'}
          header={'Depth [m]'}
          min={0}
          max={200}
          step={step}
          clickFunction={updateValue}
          externalValue={values.depth}
        ></ModeInput>
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

NetfollowingMode.propTypes = {
  title: PropTypes.string,
  step: PropTypes.number,
  modeData: PropTypes.object,
  values: PropTypes.object,
};
