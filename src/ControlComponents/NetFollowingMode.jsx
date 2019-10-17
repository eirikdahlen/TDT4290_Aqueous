import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from './Switch';
import Title from './Title';
import './css/Mode.css';
import ModeEnum from '../constants/modeEnum';
import ModeInput from './ModeInput';
import { normalize } from './../utils/utils';

const { remote } = window.require('electron');

export default function NetfollowingMode({ title, globalMode, step }) {
  const [depthValue, setDepthValue] = useState(0.0);
  const [velocityValue, setVelocityValue] = useState(0.0);
  const [distanceValue, setDistanceValue] = useState(0.0);
  const [nfActive, nfActiveChange] = useState(
    globalMode === ModeEnum.NETFOLLOWING ? true : false,
  );

  function fixValue(value, type) {
    if (type === 'velocity') {
      value = normalize(value, -10, 10);
      setVelocityValue(value);
    } else if (type === 'distance') {
      value = normalize(value, 0, 10);
      setDistanceValue(value);
    } else {
      value = normalize(value, 0, 200);
      setDepthValue(value);
    }
    return value;
  }

  // Function that is run when the update-button is clicked
  const updateValue = (value, type) => {
    // Could remove this "if" to set value before activating the switch
    if (globalMode === ModeEnum.NETFOLLOWING) {
      if (type === 'velocity') {
        remote.getGlobal('netfollowing')['velocity'] = fixValue(value, type);
      } else if (type === 'distance') {
        remote.getGlobal('netfollowing')['distance'] = fixValue(value, type);
      } else if (type === 'depth') {
        //remote.getGlobal('netfollowing')['depth'] = fixValue(value, type); TODO
      } else {
        console.log('Type not recognized');
      }
    }
  };

  // Function that is run when toggle is clicked
  const toggle = () => {
    if (remote.getGlobal('mode')['globalMode'] === ModeEnum.NETFOLLOWING) {
      remote.getGlobal('mode')['globalMode'] = ModeEnum.MANUAL;
      nfActiveChange(false);
    } else if (
      remote.getGlobal('mode')['globalMode'] === ModeEnum.MANUAL ||
      remote.getGlobal('mode')['globalMode'] === ModeEnum.DYNAMICPOSITIONING
    ) {
      remote.getGlobal('mode')['globalMode'] = ModeEnum.NETFOLLOWING;
      nfActiveChange(true);
    } else {
      console.log('Error in changing mode');
    }
  };

  return (
    <div className="Mode">
      <Title>{title}</Title>
      <div className="modeInputFlex">
        <ModeInput
          header={'Velocity'}
          min={-10}
          max={10}
          step={step}
          clickFunction={updateValue}
        ></ModeInput>
        <ModeInput
          header={'Distance'}
          min={0}
          max={10}
          step={step}
          clickFunction={updateValue}
        ></ModeInput>
        <ModeInput
          header={'Depth'}
          min={0}
          max={200}
          step={step}
          clickFunction={updateValue}
        ></ModeInput>
      </div>
      <div className="checkSwitch">
        <Switch
          isOn={nfActive}
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
  globalMode: PropTypes.number,
};
