import React from 'react';
import ValueBox from './ValueBox';
import PropTypes from 'prop-types';
import './css/Values.css';
import Title from './Title';

export default function Values({ title, values }) {
  return (
    <div className="Values">
      <Title>{title.toUpperCase()}</Title>
      <div className="valuesFlex">
        {Object.keys(values).map(value => (
          <ValueBox
            key={value}
            title={value}
            value={values[value].toFixed(2)}
          />
        ))}
      </div>
    </div>
  );
}

Values.propTypes = {
  sensorValues: PropTypes.object,
};
