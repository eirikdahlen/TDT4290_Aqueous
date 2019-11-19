import React, { useRef, useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import Gamepad from 'react-gamepad';
import { addButton, removeButton } from '../utils/buttonUtils';

export default function GamepadWrapper() {
  const alert = useAlert();
  let activeButtons = useRef([]);
  const [gamepad, setGamepad] = useState(null);

  useEffect(() => {
    window.ipcRenderer.on('vibrate-gamepad', (event, positive) => {
      let vibrationSettings;
      if (positive) {
        vibrationSettings = {
          duration: 200,
          weakMagnitude: 1.0,
          strongMagnitude: 0.0,
        };
      } else {
        vibrationSettings = {
          duration: 500,
          weakMagnitude: 0.0,
          strongMagnitude: 1.0,
        };
      }
      try {
        gamepad.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          ...vibrationSettings,
        });
      } catch (error) {
        console.log('Gamepad does not support vibration');
      }
    });
    // eslint-disable-next-line
  }, [gamepad]);

  const connectHandler = index => {
    setGamepad(navigator.getGamepads()[index]);
    alert.success('Gamepad is connected!');
  };

  const disconnectHandler = () => {
    alert.error('Gamepad disconnected');
  };

  // Runs when button is pressed or released - adds or removes button in activeButtons
  const buttonChangeHandler = (button, down) => {
    activeButtons.current = down
      ? addButton(activeButtons.current, button, 1.0)
      : removeButton(activeButtons.current, button);
    window.ipcRenderer.send('button-click', activeButtons.current);
  };

  // Run when axis changes value - adds or removes button in activeButtons
  const axisChangeHandler = (button, value) => {
    activeButtons.current = removeButton(activeButtons.current, button);
    if (Math.abs(value) > 0.0) {
      activeButtons.current = addButton(activeButtons.current, button, value);
    }
    window.ipcRenderer.send('button-click', activeButtons.current);
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
