import React, { useState } from 'react';
import ValueBox from './ValueBox';
import PropTypes from 'prop-types';
import './css/Values.css';
import Title from './Title';

/*
  {
  "desiredControl": {
    "flags": {
      "k": true,
      "m": false,
      "n": false,
      "x": false,
      "y": false,
      "z": false
    },
    "k": 0,
    "m": 0,
    "n": 0,
    "x": 0,
    "y": 0,
    "z": 0
  }
}
-------------------------------
{
  "desiredControl": {
    "flags": {
      "k": true,
      "m": false,
      "n": true,
      "x": false,
      "y": false,
      "z": true
    },
    "k": 0,
    "m": 0,
    "n": 0,
    "x": 20,
    "y": 0,
    "z": 0
  },
  "lowLevelControlManeuver.desiredHeading": {
    "control": {
      "value": 0.49999999999999994
    },
    "duration": 10
  },
  "lowLevelControlManeuver.desiredZ": {
    "control": {
      "value": 0.20000000298023224,
      "z_units": 0
    },
    "duration": 10
  }
}
---------------------
*/
const { remote } = window.require('electron');

// A container for ValueBox-components.
export default function Values({ title, values, changeEffect, IMCActive }) {
  // Handles rounding numbers and converting from boolean to numbers
  const fixValue = value => {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return Math.abs(value) >= 100 ? value.toFixed(1) : value.toFixed(2);
  };

  const renderIMC = () => {
    console.log('imc');
    console.log(values);
    Object.keys(values).map(msg => {
      console.log(msg);
    });
  };

  const renderOld = () => {
    console.log('old');
    console.log(values);
    return Object.keys(values).map(key => (
      <ValueBox
        key={key}
        title={key}
        value={fixValue(values[key])}
        changeEffect={changeEffect}
      />
    ));
  };

  return (
    <div className="Values">
      <Title>{title}</Title>
      <div className="valuesFlex">{IMCActive ? renderIMC() : renderOld()}</div>
    </div>
  );
}

Values.propTypes = {
  values: PropTypes.object,
  title: PropTypes.string,
  changeEffect: PropTypes.bool,
};
