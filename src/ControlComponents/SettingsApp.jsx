// The App for the VideoWindow. This is where every video-component should go.

import React, { useState, useEffect } from 'react';
import './css/SettingsApp.css';

const { remote } = window.require('electron');

export default function SettingsApp() {
  const { port, host, serialFile } = remote.getGlobal('settings');
  const [portInput, setPortInput] = useState(port);
  const [hostInput, setHostInput] = useState(host);
  const [serialFileInput, setSerialFileInput] = useState(serialFile);

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
      const key = e.key.toUpperCase();
      if (key === 'ENTER') {
        updateSettings();
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
    closeWindow();
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
      <button className="updateSettingsBtn" onClick={updateSettings}>
        UPDATE
      </button>
      <button className="closeSettings" onClick={closeWindow}></button>
    </div>
  );
}
