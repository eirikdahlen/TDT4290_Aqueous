import React from 'react';
import ValueBox from './ValueBox';
import PropTypes from 'prop-types';
import './css/Values.css';
import Title from './Title';
import MessageGroup from './MessageGroup';
import { fixValue, copyObjectExcept } from '../utils/utils';

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

// A container for ValueBox-components.
export default function Values({ title, values, changeEffect, IMCActive }) {
  const extractData = (msgData, msgName) => {
    if (msgName === 'netFollow' || msgName === 'goTo') {
      return { flags: false, data: msgData };
    }
    if (msgName.includes('lowLevelControlManeuver')) {
      return { flags: false, data: { value: msgData.control.value } };
    }
    if (msgName === 'desiredControl') {
      const { flags } = msgData;
      const data = copyObjectExcept(msgData, ['flags']);
      return { flags, data };
    }
  };

  const renderIMC = () => {
    return (
      <>
        {Object.keys(values).map(msgName => {
          let msgData = values[msgName];
          const { flags, data } = extractData(msgData, msgName);
          return (
            <MessageGroup
              key={msgName}
              msgName={msgName}
              data={data}
              flags={flags}
              changeEffect={changeEffect}
            ></MessageGroup>
          );
        })}
      </>
    );
  };

  const renderOld = () => {
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
