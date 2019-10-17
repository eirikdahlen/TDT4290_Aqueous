import React from 'react';
import ValueBox from './ValueBox';
import PropTypes from 'prop-types';
import './css/Values.css';
import Title from './Title';

export default function Values({ title, values }) {
  const fixValue = value => {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value.toFixed(2);
  };

  return (
    <div className="Values">
      <Title>{title}</Title>
      <div className="valuesFlex">
        {Object.keys(values).map(value => (
          <ValueBox key={value} title={value} value={fixValue(values[value])} />
        ))}
      </div>
    </div>
  );
}

Values.propTypes = {
  sensorValues: PropTypes.object,
};
