import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from './Switch';
import Title from './Title';
import './css/NetfollowingLock.css';
import ModeEnum from '../constants/modeEnum';

const { remote } = window.require('electron');

export default function DynamicpositioningLock({ title, globalMode, step }) {
  const [setting1Input, setSetting1Input] = useState(0.0);
  const [setting2Input, setSetting2Input] = useState(0.0);
  const [setting3Input, setSetting3Input] = useState(0.0);

  const [setting1Value, setSetting1Value] = useState(0.0);
  const [setting2Value, setSetting2Value] = useState(0.0);
  const [setting3Value, setSetting3Value] = useState(0.0);
  const [dpActive, dpActiveChange] = useState(
    globalMode === ModeEnum.DYNAMICPOSITIONING ? true : false,
  );

  function fixValue(value, type) {
    if (type === 'Xsetting1') {
      value = Math.min(value, 10);
      value = Math.max(value, -10);
      setSetting1Value(value);
    } else if (type === 'Ysetting2') {
      value = Math.min(value, 10);
      value = Math.max(value, -10);
      setSetting2Value(value);
    } else if (type === 'Zsetting3') {
      value = Math.min(value, 10);
      value = Math.max(value, -10);
      setSetting3Value(value);
    }
    return value;
  }

  // Function that is run when the update-button is clicked
  // Placeholder settings for now (Xsetting1, Ysetting2, Zsetting3)
  const updateValue = (value, type) => {
    // Could remove this "if" to set value before activating the switch
    if (globalMode === ModeEnum.DYNAMICPOSITIONING) {
      if (type === 'Xsetting1') {
        remote.getGlobal('dynamicpositioning')['Xsetting1'] = fixValue(
          value,
          type,
        );
      } else if (type === 'Ysetting2') {
        remote.getGlobal('dynamicpositioning')['Ysetting2'] = fixValue(
          value,
          type,
        );
      } else if (type === 'Zsetting3') {
        remote.getGlobal('dynamicpositioning')['Zsetting3'] = fixValue(
          value,
          type,
        );
      } else {
        console.log('Type not recognized');
      }
    }
  };

  // Function that is run when toggle is clicked
  const toggle = () => {
    if (
      remote.getGlobal('mode')['globalMode'] === ModeEnum.DYNAMICPOSITIONING
    ) {
      remote.getGlobal('mode')['globalMode'] = ModeEnum.MANUAL;
      dpActiveChange(false);
    } else if (
      remote.getGlobal('mode')['globalMode'] === ModeEnum.MANUAL ||
      remote.getGlobal('mode')['globalMode'] === ModeEnum.NETFOLLOWING
    ) {
      remote.getGlobal('mode')['globalMode'] = ModeEnum.DYNAMICPOSITIONING;
      dpActiveChange(true);
    } else {
      console.log('Error in changing mode');
    }
  };

  return (
    <div className="NetfollowingLock">
      <Title>{title}</Title>
      <div className="inputFlexNF">
        <h3>East</h3>
        <div className="firstRow">
          <input
            type="number"
            placeholder="x"
            step={step}
            min={-10}
            max={10}
            onChange={e => setSetting1Input(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(setting1Input, 'Xsetting1')}
          >
            &#x21bb;
          </button>
        </div>
        <h3>Down</h3>
        <div className="secondRow">
          <input
            type="number"
            placeholder="y"
            step={step}
            min={0}
            max={10}
            onChange={e => setSetting2Input(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(setting2Input, 'Ysetting2')}
          >
            &#x21bb;
          </button>
        </div>
        <h3>Down</h3>
        <div className="thirdRow">
          <input
            type="number"
            placeholder="z"
            step={step}
            min={0}
            max={10}
            onChange={e => setSetting3Input(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(setting3Input, 'Zsetting3')}
          >
            &#x21bb;
          </button>
        </div>
      </div>
      <div className="checkSwitch">
        <Switch
          isOn={dpActive}
          handleToggle={() => {
            toggle();
          }}
          id={`${title}Switch`}
          currentValue={`x: ${setting1Value.toFixed(
            1,
          )}m   y: ${setting2Value.toFixed(1)}m   z: ${setting3Value.toFixed(
            1,
          )}m`}
        />
      </div>
    </div>
  );
}

DynamicpositioningLock.propTypes = {
  title: PropTypes.string,
  step: PropTypes.number,
  globalMode: PropTypes.number,
};
