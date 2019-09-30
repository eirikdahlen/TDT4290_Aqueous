import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title.jsx';
import './css/ValueBox.css';

export default function ValueBox({ title, value }) {
  return (
    <div className="ValueBox">
      <Title>{title}</Title>
      <Value>{value}</Value>
    </div>
  );
}

function Value(props) {
  return <div className="Value">{props.children}</div>;
}

ValueBox.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};

Value.propTypes = {
  children: PropTypes.string,
};
