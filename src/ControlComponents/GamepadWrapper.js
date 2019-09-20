import React, { Component } from "react";
import Gamepad from "react-gamepad";
const { ipcRenderer } = window.require("electron");

class GamepadWrapper extends Component {
  connectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} connected!`);
  }

  disconnectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} disconnected!`);
  }

  buttonChangeHandler(buttonName, down) {
    if (down) {
      ipcRenderer.send("btn-change", { buttonName, value: 1.0 });
    }
  }

  axisChangeHandler(axisName, value, previousValue) {
    ipcRenderer.send("axis-change", { axisName, value });
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
