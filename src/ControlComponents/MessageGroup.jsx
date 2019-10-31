import React from 'react';
import './css/MessageGroup.css';
import ValueBox from './ValueBox';
import { fixValue } from '../utils/utils';

const dictionary = {
  // Values
  x: 'north',
  y: 'east',
  z: 'down',
  k: 'roll',
  m: 'pitch',
  n: 'yaw',

  // Messages
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
      {flags ? '' /*<Flags flags={flags} /> */ : ''}
      <div className="messageGroupValues">
        {Object.keys(data).map(key => (
          <ValueBox
            key={key}
            title={dictionary[key] || key}
            value={fixValue(data[key])}
            changeEffect={changeEffect}
            flag={flags ? flags[key] : null}
          />
        ))}
      </div>
    </div>
  );
}

function Flags({ flags }) {
  return (
    <>
      <table>
        <tr>
          {console.log(flags)}
          {Object.keys(flags).map(flag => (
            <td className="">{dictionary[flag]}</td>
          ))}
        </tr>
      </table>
    </>
  );
}
