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
      </div>
    </div>
  );
}
