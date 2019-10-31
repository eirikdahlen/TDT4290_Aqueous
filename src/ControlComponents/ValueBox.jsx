import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './css/ValueBox.css';

// A component for a box containing a title, a value, and a optional changeEffect.
// This is used in Values-component to display different values and show an effect on change.
export default function ValueBox({ title, value, changeEffect, flag }) {
  const [recentlyChanged, setRecentlyChanged] = useState(false);
  const nameMappings = {
    autoheading: 'AH',
    autodepth: 'AD',
  };

  // Sets a recentlyChanged-state which is used to add a temporary style when a value is changed
  useEffect(() => {
    if (changeEffect) {
      setRecentlyChanged(true);
      setTimeout(() => setRecentlyChanged(false), 500);
    }
  }, [value, changeEffect]);

  // Properly formats titles
  const fixTitle = title => {
    if (nameMappings[title]) {
      return nameMappings[title];
    } else {
      return title[0].toUpperCase() + title.slice(1);
    }
  };
  return (
    <div className={'ValueBox ' + (recentlyChanged ? 'changedValueBox' : '')}>
      <h4 className="valueBoxHeader">{fixTitle(title)}</h4>
      <h4 className="value">{value}</h4>
      {flag ? <div className="valueBoxFlag"></div> : ''}
    </div>
  );
}

ValueBox.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeEffect: PropTypes.bool,
};
