import React, { Component } from 'react';

class KeyboardInput extends Component {

  keyChangeHandler(e) {
    const validKeys = ['Q', 'E', 'W', 'S', 'D', 'C', 'V', ' ', 'I', 'J', 'K', 'L', 'Tab', 'CAPSLOCK', 'SHIFT', 'ARROWUP', 'ARROWDOWN', 'ARROWRIGHT', 'ARROWLEFT'] //update this
    const key = e.key.toUpperCase();

    if (!(validKeys.indexOf(key) >= 0)) return;
    console.log(key);
    window.ipcRenderer.send('keyboard-change', { key, value: 1.0 });
  }

  componentDidMount() {
    document.addEventListener('keyup', e => {
      this.keyChangeHandler(e);
    })
  }

  render() {
    return (
      <div></div>
    );
  }
}


export default KeyboardInput;
