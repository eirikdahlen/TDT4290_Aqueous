import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './css/AvailabilityWidget.css';

const textStyle = {
  color: '#FFFFFF',
  fontWeight: 'lighter',
};

export default function AvailabilityWidget({ nfAvailable, dpAvailable }) {
  return (
    <div className="AvailabilityWidget">
      <div className="nfdp">
        <h3 style={textStyle}>NF</h3>
        <LightDot available={nfAvailable} />
      </div>
      <div className="nfdp">
        <h3 style={textStyle}>DP</h3>
        <LightDot available={dpAvailable} />
      </div>
    </div>
  );
}

function LightDot({ available }) {
  const [recentlyChanged, setRecentlyChanged] = useState(false);

  useEffect(() => {
    setRecentlyChanged(true);
    setTimeout(() => setRecentlyChanged(false), 400);
  }, [available]);

  return (
    <div>
      <span
        className={
          'availabilityMark ' +
          (available ? 'availability ' : 'noAvailability ') +
          (recentlyChanged ? 'changed' : '')
        }
      ></span>
    </div>
  );
}

AvailabilityWidget.propTypes = {
  nfAvailable: PropTypes.bool,
  dpAvailable: PropTypes.bool,
};

LightDot.propTypes = {
  available: PropTypes.bool,
};
