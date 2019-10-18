import React from 'react';
import ValueBox from './ValueBox';
import PropTypes from 'prop-types';

export default function ForceValues({ controlValues }) {
  const forces = ['sway', 'surge', 'heave', 'yaw'];

  return (
    <div className="valuesFlex">
      <div className="Values">
        {Object.keys(controlValues)
          .filter(sensor => forces.includes(sensor))
          .map(sensor => (
            <ValueBox
              key={sensor}
              title={sensor === 'yaw' ? sensor + ' [Nm]' : sensor + ' [N]'}
              value={controlValues[sensor].toFixed(2)}
            />
          ))}
      </div>
    </div>
  );
}

ForceValues.propTypes = {
  controlValues: PropTypes.object,
};
