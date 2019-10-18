import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './css/ValueBox.css';

export default function ValueBox({ title, value, changeEffect }) {
  const [recentlyChanged, setRecentlyChanged] = useState(false);
  const nameMappings = {
    autoheading: 'AH',
    autodepth: 'AD',
  };

  useEffect(() => {
    if (changeEffect) {
      setRecentlyChanged(true);
      setTimeout(() => setRecentlyChanged(false), 500);
    }
  }, [value]);
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
    </div>
  );
}

ValueBox.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};
