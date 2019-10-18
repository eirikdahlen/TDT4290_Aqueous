import React from 'react';
import PropTypes from 'prop-types';
import './css/Title.css';

export default function Title({ children, small, available }) {
  return (
    <div className={'Title ' + (small ? 'smallTitle' : '')}>
      {children.toUpperCase()}
      {available !== undefined ? (
        <span
          className={
            'availableMark ' + (available ? 'available' : 'notAvailable')
          }
        ></span>
      ) : (
        ''
      )}
    </div>
  );
}

Title.propTypes = {
  children: PropTypes.string,
  small: PropTypes.bool,
  available: PropTypes.bool,
};
