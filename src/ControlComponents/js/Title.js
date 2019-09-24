import React from 'react';
import PropTypes from 'prop-types';

export default function Title(props) {
  return <div className="title">{props.children}</div>;
}

Title.propTypes = {
  children: PropTypes.string,
};
