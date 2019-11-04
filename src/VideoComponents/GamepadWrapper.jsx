import React, { useRef } from 'react';
import { useAlert } from 'react-alert';
import Gamepad from 'react-gamepad';
import { addButton, removeButton } from '../utils/buttonUtils';

export default function GamepadWrapper() {
  const alert = useAlert();
  let activeButtons = useRef([]);

  const connectHandler = () => {
    alert.success('XBox Controller is connected!');
  };

  const disconnectHandler = () => {
    alert.error('Note! XBox Controller disconnected');
  };

  const buttonChangeHandler = (button, down) => {
    activeButtons.current = down
      ? addButton(activeButtons.current, button, 1.0)
      : removeButton(activeButtons.current, button);
    window.ipcRenderer.send('button-click', activeButtons.current);
    console.log(activeButtons.current);
  };

  const axisChangeHandler = (button, value) => {
    activeButtons.current = removeButton(activeButtons.current, button);
    if (Math.abs(value) > 0.0) {
      activeButtons.current = addButton(activeButtons.current, button, value);
    }
    window.ipcRenderer.send('button-click', activeButtons.current);
    console.log(activeButtons.current);
  };

  return (
    <div>
      <Gamepad
        onConnect={connectHandler}
        onDisconnect={disconnectHandler}
        onButtonChange={buttonChangeHandler}
        onAxisChange={axisChangeHandler}
        deadZone={0.3}
      >
        <span></span>
      </Gamepad>
    </div>
  );
}
