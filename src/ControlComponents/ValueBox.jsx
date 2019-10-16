import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title.jsx';
import './css/ValueBox.css';

export default function ValueBox({ title, value }) {
  return (
    <div className="ValueBox">
      <Title>{title[0].toUpperCase() + title.slice(1)}</Title>
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
