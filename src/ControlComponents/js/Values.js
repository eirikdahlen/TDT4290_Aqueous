import React from 'react';
import ValueBox from './ValueBox';
import PropTypes from 'prop-types';

export default function Values(props) {
  const titles = ['North', 'East', 'Down', 'Roll', 'Pitch', 'Yaw'];

  return (
    <div className="valuesFlex">
      <div className="values">
        {titles.map((
          t,
          i, //For each title and its index
        ) => (
          <ValueBox key={i} title={t} value={props.values[i]} /> //Pass title and corresponding value (coming from Control.js) to ValueBox
        ))}
      </div>
    </div>
  );
}

Values.propTypes = {
  values: PropTypes.array,
};
