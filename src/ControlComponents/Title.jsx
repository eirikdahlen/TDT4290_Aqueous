import React from 'react';
import PropTypes from 'prop-types';
import './css/Title.css';

export default function Title({ children, small }) {
  return (
    <div className={'Title ' + (small ? 'smallTitle' : '')}>
      {children.toUpperCase()}
    </div>
  );
}

Title.propTypes = {
  children: PropTypes.string,
};
