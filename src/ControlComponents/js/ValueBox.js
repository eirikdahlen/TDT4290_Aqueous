import React from 'react';
import PropTypes from 'prop-types';

export default function ValueBox(props) {
  return (
    <div className="valueBox">
      <Title>{props.title}</Title>
      <Value>{props.value}</Value>
    </div>
  );
}

function Title(props) {
  return <div className="title">{props.children}</div>;
}

function Value(props) {
  return <div className="value">{props.children}</div>;
}

ValueBox.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
};

Title.propTypes = {
  children: PropTypes.string,
};

Value.propTypes = {
  children: PropTypes.number,
};
