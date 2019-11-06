import React from 'react';
import PropTypes from 'prop-types';
import './css/MessageGroup.css';
import ValueBox from './ValueBox';
import { fixValue } from '../utils/utils';

const dictionary = {
  // Desired control Values
  x: 'north',
  y: 'east',
  z: 'down',
  k: 'roll',
  m: 'pitch',
  n: 'yaw',

  // Net following values
  timeout: 'Time',
  d: 'Dir.',
  v: 'Velo.',
  z_units: 'Down u.',

  // Goto values
  speed_units: 'Speed u.',

  // Estimated state values

  // Messages
  desiredControl: 'Desired Control',
  'lowLevelControlManeuver.desiredZ': 'LLCM Desired Depth',
  'lowLevelControlManeuver.desiredHeading': 'LLCM Desired Heading',
  netFollow: 'Net Following',
  goTo: 'GoTo',
  customEstimatedState: 'Custom Estimated State',
  entityState: 'Entity State',
};

export default function MessageGroup({ msgName, data, flags, changeEffect }) {
  return (
    <div className="MessageGroup">
      <p className="messageGroupName">{dictionary[msgName] || msgName}</p>
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

MessageGroup.propTypes = {
  msgName: PropTypes.string,
  data: PropTypes.object,
  flags: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  changeEffect: PropTypes.bool,
};
