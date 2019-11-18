import React from 'react';
import PropTypes from 'prop-types';
import Lock from './Lock';
import Title from './Title';
import Switch from './Switch';
import './css/ManualMode.css';
import ModeEnum from '../constants/modeEnum';
import { radiansToDegrees } from './../utils/utils';

const { remote } = window.require('electron');

// Component for the manual mode. Contains two locks, autoheading and autodepth
export default function ManualMode({ title, toROV, modeData }) {
  // Sets active if the current global mode is manual, and it is always available to be used
  let active = modeData.currentMode === ModeEnum.MANUAL;
  let available = true;

  // Sets to manual mode if it is not already in manual mode
  const toggle = () => {
    if (!available || active) {
      return;
    }
    remote.getGlobal('mode')['currentMode'] = ModeEnum.MANUAL;
  };

  return (
    <div className={'Mode ' + (active ? 'activeMode' : '')}>
      <Title className="manualTitle" available={available}>
        {title.toUpperCase()}
      </Title>
      <div className="manualLockFlex">
        <Lock
          title="autoheading"
          active={toROV.autoheading}
          currentValue={radiansToDegrees(toROV.yaw)}
          min={0}
          max={360}
          step={0.5}
          manualModeActive={active}
        ></Lock>
        <Lock
          title="autodepth"
          active={toROV.autodepth}
          currentValue={toROV.heave}
          min={0}
          max={200}
          step={0.2}
          manualModeActive={active}
        ></Lock>
      </div>
      <div className="checkSwitch">
        <Switch
          isOn={active}
          handleToggle={() => {
            toggle();
          }}
          id={`${title}Switch`}
        ></Switch>
      </div>
    </div>
  );
}

ManualMode.propTypes = {
  title: PropTypes.string,
  toROV: PropTypes.object,
  modeData: PropTypes.object,
};
