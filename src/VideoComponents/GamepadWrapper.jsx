import React from 'react';
import { useAlert } from 'react-alert';
import Gamepad from 'react-gamepad';

function GamepadWrapper() {
  const alert = useAlert();

  const connectHandler = gamepadIndex => {
    console.log(`Gamepad ${gamepadIndex} connected!`);
    alert.success('XBox Controller is connected!');
  };

  const disconnectHandler = gamepadIndex => {
    console.log(`Gamepad ${gamepadIndex} disconnected!`);
    alert.error('Note! XBox Controller disconnected');
  };

  const buttonChangeHandler = (button, down) => {
    if (down) {
      // window.ipcRenderer is fetched from preload.js
      window.ipcRenderer.send('button-click', { button, value: 1.0 });
    }
  };

  const axisChangeHandler = (button, value) => {
    window.ipcRenderer.send('button-click', { button, value });
  };

  const buttonUpHandler = button => {
    window.ipcRenderer.send('button-up-down', { button, down: false });
  };

  const buttonDownHandler = button => {
    window.ipcRenderer.send('button-up-down', { button, down: true });
  };

  return (
    <div>
      <Gamepad
        onConnect={connectHandler}
        onDisconnect={disconnectHandler}
        onButtonChange={buttonChangeHandler}
        onAxisChange={axisChangeHandler}
        onButtonDown={buttonDownHandler}
        onButtonUp={buttonUpHandler}
        deadZone={0.3}
      >
        <span></span>
      </Gamepad>
    </div>
  );
}

export default GamepadWrapper;
