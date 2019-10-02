import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Title from './Title';
import Switch from './Switch';
import './css/Lock.css';

const { remote } = window.require('electron');

export default function Lock({ title, active, value, min, max, step, loop }) {
  const [reference, setReference] = useState(value);
  const [updatedReference, setUpdatedReference] = useState(value);

  console.log(title, active, value, min, max, step, loop);

  const updateClicked = () => {
    setUpdatedReference(reference);
    if (active) {
      updateLock(); //Change to updatevalue or something
    }
  };

  const toggled = () => {
    updateLock();
  };

  const updateLock = () => {
    const type = { autoheading: 'yaw', autodepth: 'heading' }[title];
    remote.getGlobal('toROV')[title] = !active;
    remote.getGlobal('toROV')[type] = active ? updatedReference : value;
    console.log(active);
  };

  return (
    <div className="Lock">
      <Title>{title}</Title>
      <div className="inputFlex">
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          onChange={e => setReference(e.target.value)}
        />
        <button className="applyButton" onClick={() => updateClicked()}>
          Update
        </button>
      </div>
      <div>
        {title}: {updatedReference}
      </div>
      <div className="check">
        <Switch isOn={active} onClick={() => toggled()} id={`${title}Switch`} />
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
