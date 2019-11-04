import React from 'react';
import PropTypes from 'prop-types';

import './css/ROVSettings.css';

export default function ROVSettings({ settings }) {
  return (
    <div className="ROVSettings_root">
      <div className="SettingsFields">
        <div className="settingsField">
          <h4>TCP</h4>
          <span>{settings.port}</span>
        </div>
        <div className="settingsField">
          <h4>IP</h4>
          <span>{settings.host}</span>
        </div>
        <div className="settingsField">
          <h4>Protocol</h4>
          <span>{settings.messageProtocol}</span>
        </div>
        <div className="settingsField">
          <h4>S-Port</h4>
          <span>{settings.boatSerialPort}</span>
        </div>
        <div className="settingsField">
          <h4>Baud</h4>
          <span>{settings.boatSerialBaudRate}</span>
        </div>
        <div className="settingsField">
          <h4>Manual Boat Heading</h4>
          <span>{settings.manualBoatHeading}</span>
        </div>
      </div>
    </div>
  );
}

ROVSettings.propTypes = {
  settings: PropTypes.object,
};
