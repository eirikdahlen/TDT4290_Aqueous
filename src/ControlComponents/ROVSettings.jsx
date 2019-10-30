import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title';

import './css/ROVSettings.css';

export default function ROVSettings({ title, settings }) {
  const {
    port,
    host,
    serialFile,
    messageProtocol,
    boatSerialPort,
    boatSerialBaudRate,
  } = settings;
  return (
    <div className="ROVSettings_root">
      <Title className="settingsTitle">{title.toUpperCase()}</Title>
      <div className="SettingsFields">
        <div className="TCPport">
          <h4>TCP port in use</h4>
          {port}
        </div>
        <div className="IpAdress">
          <h4>Host IP address</h4>
          {host}
        </div>
        <div className="SerialFile">
          <h4>Serial File in use</h4>
          {serialFile}
        </div>
        <div className="MessageProtocl">
          <h4>Current Message Protocol</h4>
          {messageProtocol}
        </div>
        <div className="BoatSerialPort">
          <h4>Boat Serial Port</h4>
          {boatSerialPort}
        </div>
        <div className="BoatSerialBaudRate">
          <h4>Boat Serial Baud Rate</h4>
          {boatSerialBaudRate}
        </div>
      </div>
    </div>
  );
}

ROVSettings.propTypes = {
  settings: PropTypes.object,
  title: PropTypes.string,
};
