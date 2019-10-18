import React from 'react';
import Lock from './Lock';
import Title from './Title';
import Switch from './Switch';
import './css/ManualMode.css';
import ModeEnum from '../constants/modeEnum';

const { remote } = window.require('electron');

export default function ManualMode({ title, toROV, modeData }) {
  let active = modeData.currentMode === ModeEnum.MANUAL;
  let available = true;

  const toggle = () => {
    if (!available || active) {
      return; // Can't turn of manual mode
    } else {
      remote.getGlobal('mode')['currentMode'] = ModeEnum.MANUAL;
    }
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
          value={toROV.yaw}
          min={0}
          max={360}
          step={0.5}
          manualModeActive={active}
        ></Lock>
        <Lock
          title="autodepth"
          active={toROV.autodepth}
          value={toROV.heave}
          min={0}
          max={400}
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
