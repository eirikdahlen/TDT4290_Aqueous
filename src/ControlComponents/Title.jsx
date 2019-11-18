import React from 'react';
import PropTypes from 'prop-types';
import './css/Title.css';

// Component for the title of the main components. Can be adjusted to be small (not bold) and have an available-mark in its corner
export default function Title({ children, small, available }) {
  return (
    <div className={'Title ' + (small ? 'smallTitle' : '')}>
      {children}
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
