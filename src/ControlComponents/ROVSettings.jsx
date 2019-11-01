import React, { useState, useEffect } from 'react';

import './css/ROVSettings.css';

const { remote } = window.require('electron');

export default function ROVSettings() {
  const [settings, setSettings] = useState(remote.getGlobal('settings'));

  useEffect(() => {
    window.ipcRenderer.on('settings-updated', () => {
      setSettings(remote.getGlobal('settings'));
    });
  }, []);

  return (
    <div className="ROVSettings_root">
      <div className="SettingsFields">
        <div className="TCPport">
          <h4>TCP</h4>
          {settings.port}
        </div>
        <div className="IpAdress">
          <h4>IP</h4>
          {settings.host}
        </div>
        <div className="MessageProtocl">
          <h4>Protocol</h4>
          {settings.messageProtocol}
        </div>
        <div className="BoatSerialPort">
          <h4>S-Port</h4>
          {settings.boatSerialPort}
        </div>
        <div className="BoatSerialBaudRate">
          <h4>Baud</h4>
          {settings.boatSerialBaudRate}
        </div>
      </div>
    </div>
  );
}
