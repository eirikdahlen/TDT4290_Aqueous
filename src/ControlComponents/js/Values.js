import React from 'react';
import ValueBox from './ValueBox';
import PropTypes from 'prop-types';

export default function Values({ sensorValues }) {
  return (
    <div className="valuesFlex">
      <div className="values">
        {Object.keys(sensorValues).map(sensor => (
          <ValueBox
            key={sensor}
            title={sensor}
            value={sensorValues[sensor].toFixed(2)}
          />
        ))}
      </div>
    </div>
  );
}

Values.propTypes = {
  values: PropTypes.array,
};
