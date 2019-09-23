import React, { Component } from 'react';
import Gamepad from 'react-gamepad';

class GamepadWrapper extends Component {
  connectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} connected!`);
  }

  disconnectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} disconnected!`);
  }

  buttonChangeHandler(buttonName, down) {
    if (down) {
      // window.ipcRenderer is fetched from preload.js
      window.ipcRenderer.send('btn-change', { buttonName, value: 1.0 });
    }
  }

  axisChangeHandler(axisName, value) {
    // window.ipcRenderer is fetched from preload.js
    window.ipcRenderer.send('axis-change', { axisName, value });
  }

  render() {
    return (
      <div>
        <Gamepad
          onConnect={this.connectHandler}
          onDisconnect={this.disconnectHandler}
          onButtonChange={this.buttonChangeHandler}
          onAxisChange={this.axisChangeHandler}
        >
          <span></span>
        </Gamepad>
      </div>
    );
  }
}

export default GamepadWrapper;
