// The App for the VideoWindow. This is where every video-component should go.

import React, { useState, useEffect } from 'react';
import './css/SettingsApp.css';

const { remote } = window.require('electron');
const MessageProtocols = require('../constants/messageProtocols');

export default function SettingsApp() {
  const {
    port,
    host,
    serialFile,
    messageProtocol,
    boatSerialPort,
    boatSerialBaudRate,
  } = remote.getGlobal('settings');

  const [portInput, setPortInput] = useState(port);
  const [hostInput, setHostInput] = useState(host);
  const [serialFileInput, setSerialFileInput] = useState(serialFile);
  const [messageProtocolInput, setMessageProtocolInput] = useState(
    messageProtocol,
  );
  const [boatSerialPortInput, setBoatSerialPortInput] = useState(
    boatSerialPort,
  );
  const [boatSerialBaudRateInput, setBoatSerialBaudRateInput] = useState(
    boatSerialBaudRate,
  );

  // Listens to the file-chosen message which is sent with the filename that is chosen
  useEffect(() => {
    window.ipcRenderer.on('file-chosen', (event, content) => {
      setSerialFileInput(content);
      document.getElementById('serialField').value = content;
    });
  });

  // Listens to enter-click which runs the updateSettings-function
  useEffect(() => {
    document.addEventListener('keydown', e => {
      if (e.key) {
        const key = e.key.toUpperCase();
        if (key === 'ENTER') {
          updateSettings();
        }
      }
    });
  });

  // Closes current window - which is the settings-window
  const closeWindow = () => {
    let w = remote.getCurrentWindow();
    w.close();
  };

  // Sends a message to the main process to open the file-picker
  const choseSerialFile = () => {
    window.ipcRenderer.send('run-file-pick');
  };

  // Function which is run on button click or enter click to update values
  const updateSettings = () => {
    remote.getGlobal('settings')['port'] = portInput;
    remote.getGlobal('settings')['host'] = hostInput;
    remote.getGlobal('settings')['serialFile'] = serialFileInput;
    remote.getGlobal('settings')['messageProtocol'] = messageProtocolInput;
    remote.getGlobal('settings')['boatSerialPort'] = boatSerialPortInput;
    remote.getGlobal('settings')[
      'boatSerialBaudRate'
    ] = boatSerialBaudRateInput;
    remote.getGlobal('settings')['boatSerialPortObject'].closePort();
    remote.getGlobal('settings')[
      // eslint-disable-next-line no-unexpected-multiline
      'boatSerialPortObject'
    ].openPort(boatSerialPortInput, boatSerialBaudRateInput);
    window.ipcRenderer.send('settings-updated');
  };

  return (
    <div className="SettingsApp">
      <div className="settingGroup">
        <label>TCP port</label>
        <input
          value={portInput}
          onChange={e => setPortInput(e.target.value)}
        ></input>
      </div>

      <div className="settingGroup">
        <label>Host IP address</label>
        <input
          value={hostInput}
          onChange={e => setHostInput(e.target.value)}
        ></input>
      </div>

      <div className="settingGroup">
        <label>Serial file</label>
        <div className="serialInputs">
          <input
            id="serialField"
            value={serialFile}
            onChange={e => setSerialFileInput(e.target.value)}
          ></input>
          <button onClick={choseSerialFile}></button>
        </div>
      </div>

      <div className="settingGroup">
        <div className="MessageProtocolMenu">
          <label>Message Protocol</label>
          <select
            className="MessageProtocolDropdown"
            value={messageProtocolInput}
            onChange={e =>
              setMessageProtocolInput(e.target.value.toUpperCase())
            }
          >
            <option value={MessageProtocols.OLD}>OLD</option>
            <option value={MessageProtocols.IMC}>IMC</option>
          </select>
        </div>
      </div>

      <div className="settingGroup">
        <label>Boat serial port</label>
        <input
          value={boatSerialPortInput}
          onChange={e => setBoatSerialPortInput(e.target.value)}
        />
      </div>

      <div className="settingGroup">
        <label>Boat serial baud rate</label>
        <input
          value={boatSerialBaudRateInput}
          onChange={e => setBoatSerialBaudRateInput(e.target.value)}
        />
      </div>

      <button className="updateSettingsBtn" onClick={updateSettings}>
        UPDATE
      </button>

      <button className="closeSettings" onClick={closeWindow}></button>
    </div>
  );
}
