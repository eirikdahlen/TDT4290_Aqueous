//Tests controls/mapping

/*
const mapping = {
  W: 'LeftStickY', //forward+
  S: 'LeftStickY', //backward-
  D: 'LeftStickX', //right+
  A: 'LeftStickX', //left-
  ARROWUP: 'LeftTrigger', //heave up
  ARROWDOWN: 'RightTrigger', //heave down
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
  Q: 'RB', //heave bias (down) +
  E: 'LB', //negative heave bias (up) -
};
*/

const { handleClick, setUpOrDown } = require('./../controls/mapping');

const prefix = 'controls/mapping: ';

const maxThruster = 400;
const biasIncrease = 10;

let toROV;
let bias;

const clearData = () => {
  // Mocks global state
  global.mode = {
    currentMode: 0,
    nfAvailable: true,
    dpAvailable: false,
  };
  global.toROV = {
    surge: 0.0,
    sway: 0.0,
    heave: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
    autodepth: false,
    autoheading: false,
  };
  global.fromROV = {
    north: 0.0,
    east: 0.0,
    down: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
  };
  global.bias = {
    surge: 0.0,
    sway: 0.0,
    heave: 0.0,
  };
  global.netfollowing = {
    distance: 0,
    velocity: 0,
    degree: 0,
    depth: 0,
  };
  toROV = {
    surge: 0.0,
    sway: 0.0,
    heave: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
    autodepth: false,
    autoheading: false,
  };
  bias = {
    surge: 0.0,
    sway: 0.0,
    heave: 0.0,
  };
};

// Reset states after every test
beforeEach(() => {
  return clearData();
});

// Tests a click on an unmapped button
test(prefix + 'invalid click', () => {
  handleClick({ button: 'none', value: 0.0 });
  expect(global.toROV).toStrictEqual(toROV);
});

// Tests surge-button forward with two different click-intensities
test(prefix + 'forward click (2 intensities)', () => {
  let clickIntensity = 1.0;
  const buttonName = 'LeftStickY';
  handleClick({
    button: buttonName,
    value: clickIntensity,
  });
  toROV['surge'] = clickIntensity * maxThruster;
  expect(global.toROV).toStrictEqual(toROV);
  clickIntensity = 0.3;
  handleClick({
    button: buttonName,
    value: clickIntensity,
  });
  toROV['surge'] = clickIntensity * maxThruster;
  expect(global.toROV).toStrictEqual(toROV);
});

// Tests surge-button backwards with two different click-intensities
test(prefix + 'backward click (2 intensities)', () => {
  let clickIntensity = -1.0;
  const buttonName = 'LeftStickY';
  handleClick({
    button: buttonName,
    value: clickIntensity,
  });
  toROV['surge'] = clickIntensity * maxThruster;
  expect(global.toROV).toStrictEqual(toROV);
  clickIntensity = -0.3;
  handleClick({
    button: buttonName,
    value: clickIntensity,
  });
  toROV['surge'] = clickIntensity * maxThruster;
  expect(global.toROV).toStrictEqual(toROV);
});

// Tests sway-button with two different click-intensities
test(prefix + 'sway click (2 directions)', () => {
  let clickIntensity = 0.8;
  const buttonName = 'LeftStickX';
  handleClick({
    button: buttonName,
    value: clickIntensity,
  });
  toROV['sway'] = clickIntensity * maxThruster;
  expect(global.toROV).toStrictEqual(toROV);
  clickIntensity = -0.3;
  handleClick({
    button: buttonName,
    value: clickIntensity,
  });
  toROV['sway'] = clickIntensity * maxThruster;
  expect(global.toROV).toStrictEqual(toROV);
});

// Tests heave-button up with two different click-intensities
test(prefix + 'heave down', () => {
  let clickIntensity = 0.1;
  const buttonName = 'LeftTrigger';
  handleClick({
    button: buttonName,
    value: clickIntensity,
  });
  toROV['heave'] = -clickIntensity * maxThruster;
  expect(global.toROV).toStrictEqual(toROV);
});

// Tests heave-button up with two different click-intensities
test(prefix + 'heave up', () => {
  let clickIntensity = 0.99;
  const buttonName = 'RightTrigger';
  handleClick({
    button: buttonName,
    value: clickIntensity,
  });
  toROV['heave'] = clickIntensity * maxThruster;
  expect(global.toROV).toStrictEqual(toROV);
});

// Tests bias buttons

test(prefix + 'set multiple biases and reset', () => {
  /*
  L: 'DPadRight', //sway bias+
  J: 'DPadLeft', //sway bias-
  I: 'DPadUp', //surge bias+
  K: 'DPadDown', //surge bias-
  Q: 'RB', //heave bias (down) +
  E: 'LB', //negative heave bias (up) -
  */
  const posBiasBtns = ['DPadRight', 'DPadUp', 'RB'];
  // Positives
  posBiasBtns.forEach(btn => {
    handleClick({
      button: btn,
      value: 1.0,
    });
  });
  ['heave', 'surge', 'sway'].forEach(type => {
    bias[type] += biasIncrease;
    toROV[type] += biasIncrease;
  });
  expect(global.bias).toStrictEqual(bias);
  expect(global.toROV).toStrictEqual(toROV);

  //Negatives
  const negBiasBtns = ['DPadLeft', 'DPadDown', 'LB'];
  negBiasBtns.forEach(btn => {
    handleClick({
      button: btn,
      value: 1.0,
    });
  });
  ['heave', 'surge', 'sway'].forEach(type => {
    bias[type] -= biasIncrease;
    toROV[type] -= biasIncrease;
  });
  expect(global.bias).toStrictEqual(bias);
  expect(global.toROV).toStrictEqual(toROV);

  // Reset all
  posBiasBtns.forEach(btn => {
    handleClick({
      button: btn,
      value: 1.0,
    });
  });
  handleClick({
    button: 'Y',
    value: 1.0,
  });
  expect(global.bias).toStrictEqual(bias);
  expect(global.toROV).toStrictEqual(toROV);

  // Reset bias axis
  posBiasBtns.forEach(btn => {
    handleClick({
      button: btn,
      value: 1.0,
    });
  });
  setUpOrDown({ button: 'X', value: 1.0 });
  handleClick({ button: 'LB', value: 1.0 });
  setUpOrDown({ button: 'X', value: 1.0 });
  bias['surge'] = 10.0;
  bias['sway'] = 10.0;
  expect(global.bias).toStrictEqual(bias);
});

// Tests AD/AH
test(prefix + 'AutoHeading/AutoDepth clicks', () => {
  /*
  V: 'B', //autoheading
  C: 'A', //autodepth
  */
  ['A', 'B'].forEach(btn => {
    handleClick({ button: btn, value: 1.0 });
  });
  toROV['autoheading'] = true;
  toROV['autodepth'] = true;
  expect(global.toROV['autoheading']).toStrictEqual(toROV['autoheading']);
  expect(global.toROV['autodepth']).toStrictEqual(toROV['autodepth']);
});
