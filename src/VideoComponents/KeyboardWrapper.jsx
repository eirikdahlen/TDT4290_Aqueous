import React, { useEffect } from 'react';

const validKeys = [
  'Q',
  'E',
  'W',
  'A',
  'S',
  'D',
  'C',
  'V',
  ' ',
  'I',
  'J',
  'K',
  'L',
  'TAB',
  'CAPSLOCK',
  'SHIFT',
  'ARROWUP',
  'ARROWDOWN',
  'ARROWRIGHT',
  'ARROWLEFT',
  'M',
]; //update this

const mapping = {
  W: 'LeftStickY', //forward+
  S: 'LeftStickY', //backward-
  D: 'LeftStickX', //right+
  A: 'LeftStickX', //left-
  ARROWUP: 'LeftTrigger', //bias up
  ARROWDOWN: 'RightTrigger', //bias down
  ARROWLEFT: 'RightStickX', //yaw-
  ARROWRIGHT: 'RightStickX', //yaw
  V: 'B', //autoheading
  C: 'A', //autodepth
  TAB: 'Y', //reset bias
  CAPSLOCK: 'X', //reset axis bias
  SHIFT: 'Back', //netfollowing
  ' ': 'Start', //dp
  L: 'DPadRight', //sway bias+
  J: 'DPadLeft', //sway bias-
  I: 'DPadUp', //surge bias+
  K: 'DPadDown', //surge bias-
  Q: 'LB', //heave bias (down) +
  E: 'RB', //negative heave bias (up) -
  M: 'LS', //set to manual mode and reset bias
};

// Buttons we dont want to send value:0 when is released
const toggles = ['C', 'V', 'SHIFT', ' '];

// Buttons we want to send negative values for
const negatives = ['S', 'A', 'ARROWLEFT'];

export default function KeyboardWrapper() {
  const keyChangeHandler = (e, down) => {
    const key = e.key.toUpperCase();
    if (!(validKeys.indexOf(key) >= 0)) return;
    if (toggles.indexOf(key) >= 0 && !down) return;
    const value = down ? 1.0 : 0.0;
    const multiplier = negatives.indexOf(key) >= 0 ? -1 : 1;
    window.ipcRenderer.send('button-click', {
      button: mapping[key],
      value: value * multiplier,
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', e => {
      keyChangeHandler(e, true);
    });
    document.addEventListener('keyup', e => {
      keyChangeHandler(e, false);
    });
    return () => {
      document.removeEventListener('keyup', keyChangeHandler);
      document.removeEventListener('keydown', keyChangeHandler);
    };
  }, []);
  return <span></span>;
}
