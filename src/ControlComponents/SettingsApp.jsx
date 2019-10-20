// The App for the VideoWindow. This is where every video-component should go.

import React, { useState, useEffect } from 'react';
import './css/SettingsApp.css';

const { remote } = window.require('electron');

export default function SettingsApp() {
  const { port, host, serialFile } = remote.getGlobal('settings');
  const [portInput, setPortInput] = useState(port);
  const [hostInput, setHostInput] = useState(host);
  const [serialFileInput, setSerialFileInput] = useState(serialFile);

  useEffect(() => {
    window.ipcRenderer.on('file-chosen', (event, content) => {
      setSerialFileInput(content);
      document.getElementById('serialField').value = content;
    });
  });

  const choseSerialFile = () => {
    window.ipcRenderer.send('run-file-pick');
  };

  const updateSettings = () => {
    if (portInput !== port) {
      remote.getGlobal('settings')['port'] = portInput;
    }
    if (hostInput !== host) {
      remote.getGlobal('settings')['host'] = hostInput;
    }
    if (serialFileInput !== serialFile) {
      remote.getGlobal('settings')['serialFile'] = serialFileInput;
    }
    let w = remote.getCurrentWindow();
    w.close();
  };

  return (
    <div className="SettingsApp">
      <div className="settingGroup">
        <label>Port</label>
        <input
          value={portInput}
          onChange={e => setPortInput(e.target.value)}
        ></input>
      </div>
      <div className="settingGroup">
        <label>Host</label>
        <input
          value={hostInput}
          onChange={e => setHostInput(e.target.value)}
        ></input>
      </div>
      <div className="settingGroup">
        <label>Serial file</label>
        <input
          id="serialField"
          value={serialFile}
          onChange={e => setSerialFileInput(e.target.value)}
        ></input>
      </div>
      <button className="updateSettingsBtn" onClick={updateSettings}>
        Update
      </button>
      <button onClick={choseSerialFile}></button>
    </div>
  );
}
