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
    /*boatSerialPort,
    boatSerialBaudRate,*/
    manualBoatHeading,
    useManualHeading,
    mapRotation,
  } = remote.getGlobal('settings');

  const [portInput, setPortInput] = useState(port);
  const [hostInput, setHostInput] = useState(host);
  const [serialFileInput, setSerialFileInput] = useState(serialFile);
  const [messageProtocolInput, setMessageProtocolInput] = useState(
    messageProtocol,
  );
  /*const [boatSerialPortInput, setBoatSerialPortInput] = useState(
    boatSerialPort,
  );
  const [boatSerialBaudRateInput, setBoatSerialBaudRateInput] = useState(
    boatSerialBaudRate,
  );*/
  const [headingInput, setHeadingInput] = useState(manualBoatHeading);
  const [useManualInput, setUseManualInput] = useState(useManualHeading);
  const [mapRotationInput, setMapRotationInput] = useState(mapRotation);
  const [inputsChanged, setInputsChanged] = useState([]);

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
  const chooseSerialFile = () => {
    window.ipcRenderer.send('run-file-pick');
  };

  // Function run when an input field is run - updates its state and sets changed-class
  const handleChange = (event, setFunction) => {
    const el = event.target;
    setFunction(el.value);
    el.classList.remove('updatedInput');
    el.classList.add('changedInput');
    if (inputsChanged.indexOf(el) < 0) {
      inputsChanged.push(el);
    }
  };

  // Adds style to inputs that are updated
  const updateStyle = () => {
    inputsChanged.forEach(input => {
      input.classList.remove('changedInput');
      input.classList.add('updatedInput');
    });
    setInputsChanged([]);
  };

  // Function which is run on button click or enter click to update values
  const updateSettings = () => {
    remote.getGlobal('settings')['port'] = portInput;
    remote.getGlobal('settings')['host'] = hostInput;
    remote.getGlobal('settings')['serialFile'] = serialFileInput;
    remote.getGlobal('settings')['messageProtocol'] = messageProtocolInput;
    remote.getGlobal('settings')['manualBoatHeading'] = headingInput;
    remote.getGlobal('settings')['useManualHeading'] = useManualInput;
    remote.getGlobal('settings')['mapRotation'] = mapRotationInput;
    /*remote.getGlobal('settings')['boatSerialPort'] = boatSerialPortInput;
    remote.getGlobal('settings')[
      'boatSerialBaudRate'
    ] = boatSerialBaudRateInput;
    
    try {
      remote.getGlobal('settings')['boatSerialPortObject'].closePort();
      remote.getGlobal('settings')[
        // eslint-disable-next-line no-unexpected-multiline
        'boatSerialPortObject'
      ].openPort(boatSerialPortInput, boatSerialBaudRateInput);
    } catch (error) {
      window.ipcRenderer.send('settings-updated');
    }*/
    updateStyle();
    window.ipcRenderer.send('settings-updated');
  };

  return (
    <div className="SettingsApp">
      <h2>SETTINGS</h2>
      <div className="settingGroup">
        <label>TCP Port</label>
        <div className="inputContainer">
          <input
            value={portInput}
            onChange={e => handleChange(e, setPortInput)}
          ></input>
          <div className="inputStatus"></div>
        </div>
      </div>

      <div className="settingGroup">
        <label>Host IP Address</label>
        <div className="inputContainer">
          <input
            value={hostInput}
            onChange={e => handleChange(e, setHostInput)}
          ></input>
          <div className="inputStatus"></div>
        </div>
      </div>

      <div className="settingGroup">
        <label>Serial File</label>
        <div className="twoInputs">
          <div className="inputContainer">
            <input
              id="serialField"
              value={serialFile}
              onChange={e => handleChange(e, setSerialFileInput)}
            ></input>
            <div className="inputStatus"></div>
          </div>
          <button onClick={chooseSerialFile}></button>
        </div>
      </div>

      <div className="settingGroup">
        <div className="MessageProtocolMenu">
          <label>Message Protocol</label>
          <div className="inputContainer">
            <select
              className="MessageProtocolDropdown"
              value={messageProtocolInput}
              onChange={e => handleChange(e, setMessageProtocolInput)}
            >
              <option value={MessageProtocols.OLD}>OLD</option>
              <option value={MessageProtocols.IMC}>IMC</option>
            </select>
            <div className="inputStatus"></div>
          </div>
        </div>
      </div>

      {/*<div className="settingGroup">
        <label>Boat serial port</label>
        <div className="inputContainer">
          <input
            value={boatSerialPortInput}
            onChange={e => handleChange(e, setBoatSerialPortInput)}
          />
          <div className="inputStatus"></div>
        </div>
      </div>

      <div className="settingGroup">
        <label>Boat serial baud rate</label>
        <div className="inputContainer">
          <input
            value={boatSerialBaudRateInput}
            onChange={e => handleChange(e, setBoatSerialBaudRateInput)}
          />
          <div className="inputStatus"></div>
        </div>
  </div>*/}

      <div className="settingGroup">
        <label>Manual Boat Heading</label>
        <div className="twoInputs">
          <div className="inputContainer">
            <input
              style={{
                backgroundColor: useManualInput ? 'white' : '#eaeaea',
              }} //using inline style to avoid interference with inputStatus-style
              value={headingInput}
              type="number"
              step={1}
              min={0}
              max={360}
              onChange={e => handleChange(e, setHeadingInput)}
            />
            <div className="inputStatus"></div>
          </div>
          <input
            className="useManual"
            checked={useManualInput}
            type="checkbox"
            onChange={() => setUseManualInput(!useManualInput)}
          ></input>
        </div>
      </div>

      <div className="settingGroup">
        <label>Rotate Minimap Boat:</label>
        <div>
          <input
            id="mapRotation"
            checked={mapRotationInput}
            type="checkbox"
            onChange={() => setMapRotationInput(!mapRotationInput)}
          ></input>
        </div>
      </div>

      <button className="updateSettingsBtn" onClick={updateSettings}>
        UPDATE
      </button>

      <button className="closeSettings" onClick={closeWindow}></button>
    </div>
  );
}
