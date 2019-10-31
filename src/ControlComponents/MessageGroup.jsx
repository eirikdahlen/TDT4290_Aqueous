import React from 'react';
import './css/MessageGroup.css';
import ValueBox from './ValueBox';
import { fixValue } from '../utils/utils';

const dictionary = {
  x: 'north',
  y: 'east',
  z: 'down',
  k: 'roll',
  m: 'pitch',
  n: 'yaw',
  desiredControl: 'Desired Control',
  'lowLevelControlManeuver.desiredZ': 'LLCM.desiredZ',
  'lowLevelControlManeuver.desiredHeading': 'LLCM.desiredHeading',
  netFollow: 'Net Follow',
  goTo: 'GoTo',
};

export default function MessageGroup({ msgName, data, flags, changeEffect }) {
  return (
    <div className="MessageGroup">
      <p className="messageGroupName">{dictionary[msgName] || msgName}</p>
      {flags ? <div>{JSON.stringify(flags)}</div> : ''}
      <div className="messageGroupValues">
        {Object.keys(data).map(key => (
          <ValueBox
            key={key}
            title={dictionary[key] || key}
            value={fixValue(data[key])}
            changeEffect={changeEffect}
          />
        ))}
      </div>
    </div>
  );
}
