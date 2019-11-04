import React, { useState } from 'react';
import { useAlert } from 'react-alert';
import Gamepad from 'react-gamepad';
import { addButton, removeButton } from '../utils/buttonUtils';

export default function GamepadWrapper() {
  const alert = useAlert();
  const [activeButtons, setActiveButtons] = useState([]);

  const connectHandler = () => {
    alert.success('XBox Controller is connected!');
  };

  const disconnectHandler = () => {
    alert.error('Note! XBox Controller disconnected');
  };

  const buttonChangeHandler = (button, down) => {
    setActiveButtons(
      down
        ? addButton(activeButtons, button, 1.0)
        : removeButton(activeButtons, button),
    );
    window.ipcRenderer.send('button-click', activeButtons);
  };

  const axisChangeHandler = (button, value) => {
    setActiveButtons(removeButton(activeButtons, button));
    if (Math.abs(value) > 0.0) {
      setActiveButtons(addButton(activeButtons, button, value));
    }
    window.ipcRenderer.send('button-click', activeButtons);
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
