import React, { Component } from 'react';
import { useAlert } from 'react-alert';
import Gamepad from 'react-gamepad';

const { alert } = useAlert();

class GamepadWrapper extends Component {
  connectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} connected!`);
  }

  disconnectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} disconnected!`);
  }

  buttonChangeHandler(button, down) {
    if (down) {
      // window.ipcRenderer is fetched from preload.js
      window.ipcRenderer.send('button-click', { button, value: 1.0 });
    }
  }

  axisChangeHandler(button, value) {
    window.ipcRenderer.send('button-click', { button, value });
  }

  buttonUpHandler(button) {
    window.ipcRenderer.send('button-up-down', { button, down: false });
  }

  buttonDownHandler(button) {
    window.ipcRenderer.send('button-up-down', { button, down: true });
  }

  // Tanken er at man lager en ekstra funksjon/CustomHook til å kalle på de to andre, og bruke denne ved onConnect
  // Feilmelding om at "connectHandler is not defined"?
  useConnection(gamepadIndex) {
    connectHandler(gamepadIndex);
    alert.success('XBox Controller is connected!');
  }

  useDisconnection(gamepadIndex) {
    disconnectHandler(gamepadIndex);
    alert.error('Note! XBox Controller disconnected');
  }

  render() {
    return (
      <div>
        <Gamepad
          onConnect={this.useConnection}
          onDisconnect={this.useDisconnection}
          onButtonChange={this.buttonChangeHandler}
          onAxisChange={this.axisChangeHandler}
          onButtonDown={this.buttonDownHandler}
          onButtonUp={this.buttonUpHandler}
          deadZone={0.3}
        >
          <span></span>
        </Gamepad>
      </div>
    );
  }
}

export default GamepadWrapper;
