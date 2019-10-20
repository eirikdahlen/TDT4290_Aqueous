// The App for the VideoWindow. This is where every video-component should go.

import React, { useState } from 'react';

const { remote } = window.require('electron');

export default function SettingsApp() {
  const { port, host, serialFile } = remote.getGlobal('settings');
  const [portInput, setPortInput] = useState(port);
  const [hostInput, setHostInput] = useState(host);
  const [serialFileInput, setSerialFileInput] = useState(serialFile);

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
          placeholder={port}
          onChange={e => setPortInput(e.target.value)}
        ></input>
      </div>
      <div className="settingGroup">
        <label>Host</label>
        <input
          placeholder={host}
          onChange={e => setHostInput(e.target.value)}
        ></input>
      </div>
      <div className="settingGroup">
        <label>Serial file</label>
        <input
          placeholder={serialFile}
          onChange={e => setSerialFileInput(e.target.value)}
        ></input>
      </div>
      <button onClick={updateSettings}>Update</button>
    </div>
  );
}
