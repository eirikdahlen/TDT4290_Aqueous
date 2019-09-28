import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title.jsx';
import './css/ValueBox.css';

export default function ValueBox(props) {
  return (
    <div className="ValueBox">
      <Title>{props.title}</Title>
      <Value>{props.value}</Value>
    </div>
  );
}

function Value(props) {
  return <div className="Value">{props.children}</div>;
}

ValueBox.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
};

Value.propTypes = {
  children: PropTypes.number,
};
