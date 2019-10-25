import React, { Component } from 'react';
import Gamepad from 'react-gamepad';

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

  render() {
    return (
      <div>
        <Gamepad
          onConnect={this.connectHandler}
          onDisconnect={this.disconnectHandler}
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
