import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from './Switch';
import Title from './Title';
import './css/Mode.css';
import ModeEnum from '../constants/modeEnum';
import { normalize, degreesToRadians } from './../utils/utils';
import ModeInput from './ModeInput';

const { remote } = window.require('electron');

// DP mode component for setting DP-values and toggling DP on and off
export default function DynamicPositioningMode({
  title,
  modeData,
  step,
  fromROV,
}) {
  const attributes = ['north', 'east', 'down', 'yaw'];
  const euclideanAttributes = ['north', 'east', 'down'];

  // Attributes to ensure valid state - not too big DP distance set
  const [isStateValid, setStateValid] = useState(true);
  const [errorInfo, setErrorInfo] = useState({
    attribute: '',
    value: 0.0,
    euclideanDistance: 0.0,
  });
  const maxEuclideanDistance = 2;

  // Active if the current mode of the ROV is DP, available if the dpavailable flag is true
  let active = modeData.currentMode === ModeEnum.DYNAMICPOSITIONING;
  let available = modeData.dpAvailable;

  // Converts value of type withing proper range and format
  function fixValue(value, type) {
    if (type === 'north') {
      // Normalize value somehow here
    } else if (type === 'east') {
      // Normalize value somehow here
    } else if (type === 'down') {
      value = normalize(value, 0, 200);
    } else if (type === 'yaw') {
      value = degreesToRadians(value);
    }
    return value;
  }

  // Calculates euclidean distance between dp settings and current position
  // newValue and type is optional if a check is needed with a new value
  const getEuclideanDistance = (newValue, type) => {
    const newDP = JSON.parse(
      JSON.stringify(remote.getGlobal('dynamicpositioning')),
    ); // Copies object to avoid modifying global state
    if (newValue && type) {
      newDP[type] = newValue;
    }
    return Math.sqrt(
      euclideanAttributes.reduce((acc, attribute) => {
        return acc + Math.pow(newDP[attribute] - fromROV[attribute], 2);
      }, 0.0),
    ).toFixed(2);
  };

  // Function that is run when the update-button is clicked - updates the global dp-variable with value
  // Also validates as a safety measure if euclidean distance of proposed NED is small enough
  const updateValue = (value, type) => {
    if (attributes.indexOf(type) < 0) {
      return;
    }
    const newValue = fixValue(value, type);
    const euclideanDistance = getEuclideanDistance(newValue, type);
    if (euclideanDistance > maxEuclideanDistance) {
      setErrorInfo({ attribute: type, value: newValue, euclideanDistance });
      setStateValid(false);
    } else {
      setStateValid(true);
      remote.getGlobal('dynamicpositioning')[type] = newValue;
    }
  };
  // Function that is run when toggle is clicked - sets to DP if dp is not current mode, sets to manual if dp is current
  const toggle = () => {
    if (!available) {
      return;
    }
    if (modeData.currentMode === ModeEnum.DYNAMICPOSITIONING) {
      remote.getGlobal('mode')['currentMode'] = ModeEnum.MANUAL;
    } else if (
      modeData.currentMode === ModeEnum.MANUAL ||
      modeData.currentMode === ModeEnum.NETFOLLOWING
    ) {
      setCurrentPosition();
      remote.getGlobal('mode')['currentMode'] = ModeEnum.DYNAMICPOSITIONING;
    } else {
      console.log('Error - unable to change mode');
    }
  };

  // Updates input-fields and the global DP settings to the current position
  const setCurrentPosition = () => {
    attributes.forEach(attribute => {
      const currentPosition = Number(fromROV[attribute]);
      const inputField = document.getElementById(attribute);
      inputField.value = currentPosition.toFixed(2);
      remote.getGlobal('dynamicpositioning')[attribute] = currentPosition;
    });
    setStateValid(true);
  };

  return (
    <div className={'Mode ' + (active ? 'activeMode' : '')}>
      <Title available={available}>{title.toUpperCase()}</Title>
      <div className="modeInputFlex">
        <div className="modeInputRow">
          <ModeInput
            inputId="north"
            header="North"
            step={step}
            clickFunction={updateValue}
          ></ModeInput>
          <ModeInput
            inputId="east"
            header="East"
            step={step}
            clickFunction={updateValue}
          ></ModeInput>
        </div>
        <div className="modeInputRow">
          <ModeInput
            inputId="down"
            header="Down"
            step={step}
            min={0}
            max={200}
            clickFunction={updateValue}
          ></ModeInput>
          <ModeInput
            inputId="yaw"
            header="Yaw"
            step={step}
            min={0}
            max={360}
            clickFunction={updateValue}
          ></ModeInput>
        </div>
        <button onClick={() => setCurrentPosition()} className="DPCurrentBtn">
          <span>Use current position</span>
        </button>
        <p className={'DPWarning ' + (isStateValid ? '' : 'DPWarningShow')}>
          Could not set {errorInfo.attribute} to {errorInfo.value}. <br />
          <br />
          The resulting euclidean distance ({errorInfo.euclideanDistance}) would
          be greater than {maxEuclideanDistance}.
        </p>
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

DynamicPositioningMode.propTypes = {
  title: PropTypes.string,
  step: PropTypes.number,
  modeData: PropTypes.object,
  fromROV: PropTypes.object,
};
