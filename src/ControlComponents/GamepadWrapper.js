import React, { Component } from "react";
import Gamepad from 'react-gamepad'

const electron = window.require("electron");

/*let tcp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const keys = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  lBump: 4,
  rBump: 5,
  lTrig: 6,
  rTrig: 7,
  Up: 8, //D Pad Up button is pressed or the Left Stick is pushed up (above stickThreshold)
  Down: 9, //D Pad Down  button is pressed or the Left Stick is pushed down (above stickThreshold)
  Left: 10, //D Pad Left button is pressed or the Left Stick is pushed left (above stickThreshold)
  Right: 11, //D Pad Right button is pressed or the Left Stick is pushed right (above stickThreshold)
  Menu: 12,
  View: 13
}; */

let axisTCP = {
  axisName: "",
  value: 0
}

let btnTCP = {
  buttonName: "",
  pressed: false
}

class GamepadWrapper extends Component {
  connectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} connected!`)
  }

  disconnectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} disconnected!`)
  }

  buttonChangeHandler(buttonName, down) {
    console.log(buttonName, down)
    btnTCP.buttonName = buttonName;
    btnTCP.pressed = down;
    electron.ipcRenderer.send("btn-change", btnTCP);
  }

  axisChangeHandler(axisName, value, previousValue) {
    console.log(axisName, value)
    axisTCP.axisName = axisName;
    axisTCP.value = value;
    electron.ipcRenderer.send("axis-change", axisTCP);
  }

  buttonDownHandler(buttonName) {
    console.log(buttonName, 'down')
  }

  buttonUpHandler(buttonName) {
    console.log(buttonName, 'up')
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
          <p>random text</p>
        </Gamepad>
      </div>
    )
  }
}

export default GamepadWrapper;