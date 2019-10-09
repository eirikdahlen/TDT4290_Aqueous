import React, { Component } from 'react';

class KeyboardInput extends Component {
  keyChangeHandler(e) {
    const validKeys = [
      'Q',
      'E',
      'W',
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
    const key = e.key.toUpperCase();
    let multiplier = 1;
    const negatives = ['S', 'A'];
    if (negatives.indexOf(key) >= 0) {
      multiplier = -1;
    }
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

    if (!(validKeys.indexOf(key) >= 0)) return;
    console.log(key);
    window.ipcRenderer.send('xbox-change', {
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

export default KeyboardInput;
