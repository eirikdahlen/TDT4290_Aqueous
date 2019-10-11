import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from './Switch';
import Title from './Title';
import './css/NetfollowingLock.css';

const { remote } = window.require('electron');

export default function DynamicpositioningLock({ title, active, step }) {
  const [input, changeInput] = useState(0.0);
  const [setting1Value, setSetting1Value] = useState(0.0);
  const [setting2Value, setSetting2Value] = useState(0.0);
  const [setting3Value, setSetting3Value] = useState(0.0);

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
    if (active) {
      if (type === 'Xsetting1') {
        remote.getGlobal('Xdynamicpositioning')['Xsetting1'] = fixValue(
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
    remote.getGlobal('dynamicpositioning')['active'] = !active;
  };

  return (
    <div className="NetfollowingLock">
      <Title>{title}</Title>
      <div className="inputFlexNF">
        <h3>x (placeholder)</h3>
        <div className="firstRow">
          <input
            type="number"
            placeholder="x"
            step={step}
            min={-10}
            max={10}
            onChange={e => changeInput(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(input, 'Xsetting1')}
          >
            &#x21bb;
          </button>
        </div>
        <h3>y (placeholder)</h3>
        <div className="secondRow">
          <input
            type="number"
            placeholder="y"
            step={step}
            min={0}
            max={10}
            onChange={e => changeInput(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(input, 'Ysetting2')}
          >
            &#x21bb;
          </button>
        </div>
        <h3>z (placeholder)</h3>
        <div className="thirdRow">
          <input
            type="number"
            placeholder="z"
            step={step}
            min={0}
            max={10}
            onChange={e => changeInput(Number(e.target.value))}
          />
          <button
            className="updateButton"
            onClick={() => updateValue(input, 'Zsetting3')}
          >
            &#x21bb;
          </button>
        </div>
      </div>
      <div className="checkSwitch">
        <Switch
          isOn={active}
          handleToggle={() => {
            toggle();
          }}
          id={`${title}Switch`}
          currentValue={`x: ${setting1Value.toFixed(
            1,
          )}m   y: ${setting2Value.toFixed(1)}m z: ${setting3Value.toFixed(
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
  active: PropTypes.bool,
};
