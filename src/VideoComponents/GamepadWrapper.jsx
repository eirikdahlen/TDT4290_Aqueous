import React, { useState, useRef } from 'react';
import { useAlert } from 'react-alert';
import Gamepad from 'react-gamepad';

export default function GamepadWrapper() {
  const alert = useAlert();

  let activeButtons = useRef([]);

  const hasButton = (arr, button) => {
    return arr.some(obj => {
      return obj.button === button;
    });
  };

  const removeButton = (arr, button) => {
    if (hasButton(activeButtons.current, button)) {
      arr = arr.filter(obj => {
        return obj.button !== button;
      });
    }
    return arr;
  };

  const addButton = (arr, button, value) => {
    if (!hasButton(activeButtons.current, button)) {
      arr.push({ button, value });
    }
    return arr;
  };

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
