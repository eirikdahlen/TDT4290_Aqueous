import React from 'react';
import PropTypes from 'prop-types';

export default function ControlBox(props) {
  return (
    <div className="controlBox">
      <h1>{props.name}</h1>
    </div>
  );
}

ControlBox.propTypes = {
  name: PropTypes.string,
};
