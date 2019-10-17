import React from 'react';
import PropTypes from 'prop-types';
import './css/ValueBox.css';

export default function ValueBox({ title, value }) {
  return (
    <div className="ValueBox">
      <h4 className="valueBoxHeader">
        {title[0].toUpperCase() + title.slice(1)}
      </h4>
      <h4 className="value">{value}</h4>
    </div>
  );
}

ValueBox.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};
