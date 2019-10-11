import React, { Component } from 'react';

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
]; //update this

const mapping = {
  W: 'LeftStickY', //forward+
  S: 'LeftStickY', //backward-
  D: 'LeftStickX', //right+
  A: 'LeftStickX', //left-
  ARROWUP: 'LeftTrigger', //bias up
  ARROWDOWN: 'RightTrigger', //bias down
  ARROWLEFT: 'RightStickX', //yaw
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
  Q: 'RB', //heave bias (down) +
  E: 'LB', //negative heave bias (up) -
};

class KeyboardWrapper extends Component {
  keyChangeHandler(e) {
    const key = e.key.toUpperCase();
    if (!(validKeys.indexOf(key) >= 0)) return;
    const multiplier = ['S', 'A'].indexOf(key) >= 0 ? -1 : 1;
    console.log(key);
    window.ipcRenderer.send('button-click', {
      button: mapping[key],
      value: 1.0 * multiplier,
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', e => {
      this.keyChangeHandler(e);
    });
  }

  render() {
    return <div></div>;
  }
}

export default KeyboardWrapper;
