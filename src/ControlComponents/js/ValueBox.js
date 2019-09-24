import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title.js';

export default function ValueBox(props) {
  return (
    <div className="valueBox">
      <Title>{props.title}</Title>
      <Value>{props.value}</Value>
    </div>
  );
}

function Value(props) {
  return <div className="value">{props.children}</div>;
}

ValueBox.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
};

Value.propTypes = {
  children: PropTypes.number,
};
