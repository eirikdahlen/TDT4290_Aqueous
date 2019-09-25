import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title.js';
const { ipcRenderer, remote } = window.require('electron');

export default function Lock(props) {
  const [active, setActive] = React.useState(props.active);
  const [ref, setRef] = React.useState(props.value || 0.0); //local reference
  const min = React.useState(props.loop ? props.min - props.step : props.min); //to make values wrap around correctly

  function updateReference(event) {
    //updates reference locally
    let value = Number(event.target.value);

    if (props.loop && value >= props.max) {
      //a value greater than max will wrap around given loop is true
      setRef(value % props.max);
    } else if (props.loop && value === min[0]) {
      //wraps value around if it is decremented from its minimal value given loop is true
      setRef((props.max * 10 - props.step * 10) / 10);
    } else if (value > props.max) {
      //a value greater than max will set the reference to max
      setRef(props.max);
    } else if (value < props.min) {
      //a value less than min will set the reference to min
      setRef(props.min);
    } else if (event.target.value === '') {
      //set ref to min if nothing is entered
      setRef(props.min);
    } else {
      setRef(value);
    }
  }

  function applyReference() {
    //sends new reference to ROV and sets autoflag if it's not active already
    setActive(true);
    let newToROV = remote.getGlobal('toROV');
    switch (props.title) {
      case 'AutoDepth':
        if (!active) {
          newToROV.autodepth = true;
        }
        newToROV.heave = Number(ref);
        ipcRenderer.send('toROV', newToROV);
        console.log('applying autodepth:' + ref);
        break;
      case 'AutoHeading':
        if (!active) {
          newToROV.autoheading = true;
        }
        newToROV.yaw = Number(ref);
        ipcRenderer.send('toROV', newToROV);
        console.log('applying autoheading:' + ref);
        break;
      default:
        console.log('Unrecognized title');
    }
  }

  function updateActive() {
    active ? lockUnlock(false) : lockUnlock(true);
  }

  function lockUnlock(lock) {
    //locks or unlocks autodepth/heading depending on lock parameter
    let newToROV = remote.getGlobal('toROV');
    setActive(lock);
    switch (props.title) {
      case 'AutoDepth':
        newToROV.autodepth = lock;
        if (!lock) {
          newToROV.heave = 0;
        } //sets commanded force to 0 if autodepth is deactivated
        ipcRenderer.send('toROV', newToROV);
        break;
      case 'AutoHeading':
        newToROV.autoheading = lock;
        if (!lock) {
          newToROV.yaw = 0;
        } //sets commanded force to 0 if autoheading is deactivated
        ipcRenderer.send('toROV', newToROV);
        break;
      default:
        console.log('Unrecognized title');
    }
  }

  return (
    <div className="lock">
      <Title>{props.title}</Title>
      <div className="inputFlex">
        <input
          type="number"
          value={ref}
          onChange={updateReference}
          step={props.step}
          min={min}
          max={props.max}
        />
        <button className="applyButton" onClick={() => applyReference()}>
          Apply
        </button>
      </div>
      <div className="check">
        <input type="checkbox" onChange={updateActive} checked={active} />
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
