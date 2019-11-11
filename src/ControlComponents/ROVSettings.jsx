import React from 'react';
import PropTypes from 'prop-types';

import './css/ROVSettings.css';

// Contains which global settings to use (key) and which name it should display (value)
const showSettings = {
  port: 'TCP',
  host: 'IP',
  messageProtocol: 'Protocol',
  /*boatSerialPort: 'S-port',
  boatSerialBaudRate: 'Baud',*/
  manualBoatHeading: 'Boat heading',
  mapRotation: 'Rotate boat',
};

export default function ROVSettings({ settings }) {
  return (
    <div className="ROVSettings_root">
      <div className="SettingsFields">
        {Object.keys(showSettings).map(key => {
          if (key in settings) {
            return (
              <div key={key} className="settingsField">
                <h4>{showSettings[key]}</h4>
                <span>{settings[key].toString()}</span>
              </div>
            );
          } else {
            return '';
          }
        })}
      </div>
    </div>
  );
}

ROVSettings.propTypes = {
  settings: PropTypes.object,
};
