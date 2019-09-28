// Function called from IPC.js when xbox-buttons are changed - maps buttons

// Constants
const maxThruster = 400;
const biasIncrease = 10;
const biasIncreaseTimer = 200;
const maxYaw = 2 * Math.PI;

// Bias values
let bias = {
  surge: 0.0,
  sway: 0.0,
  heave: 0.0,
};

// Store biasButtons as object for faster checking if a button is a bias-button
const biasButtons = {
  DPadRight: 1,
  DPadLeft: 1,
  DPadUp: 1,
  DPadDown: 1,
  RB: 1,
  LB: 1,
};

// Auto settings
let autoDepth = false;
let depthReference = 0.0; // Depth in meters
let depthIncrement = 0.4; // Meters

let autoHeading = false;
let headingReference = 0.0; // Radians
let headingIncrement = 0.1; // Radians

// Which button is held down
let buttonDown;

//Interval for increasing bias continously
setInterval(() => {
  if (biasButtons[buttonDown]) {
    handleClick({ button: buttonDown, value: 1 });
  }
}, biasIncreaseTimer);

//Function for setting if X or bias-buttons are held down
function setUpOrDown({ button, down }) {
  if (button === 'X' || biasButtons[button]) {
    buttonDown = down ? button : '';
  }
}

// Converst from button (buttonname) and value (how much pressed) to values for the ROV
function handleClick({ button, value }) {
  let controls = {
    surge: bias.surge,
    sway: bias.sway,
    heave: autoDepth ? depthReference : bias.heave,
    roll: 0.0,
    pitch: 0.0,
    yaw: autoHeading ? headingReference : 0.0,
    autodepth: autoDepth,
    autoheading: autoHeading,
  };
  switch (button) {
    // LEFT STICK + TRIGGERS | SURGE, HEAVE, SWAY
    case 'LeftStickY': // Forward+/Backward-
      controls['surge'] += value * maxThruster;
      fixMaxThruster('surge', controls);
      break;
    case 'LeftStickX': // Right+/Left-
      controls['sway'] += value * maxThruster;
      fixMaxThruster('sway', controls);
      break;
    case 'LeftTrigger': // Up
      if (!autoDepth) {
        controls['heave'] += value * -maxThruster;
        fixMaxThruster('heave', controls);
      } else {
        depthReference -= value * depthIncrement;
        controls['heave'] = depthReference;
      }
      break;
    case 'RightTrigger': // Down
      if (!autoDepth) {
        controls['heave'] += value * maxThruster;
        fixMaxThruster('heave', controls);
      } else {
        depthReference += value * depthIncrement;
        controls['heave'] = depthReference;
      }
      break;

    // RIGHT STICK | HEADING/YAW
    case 'RightStickX': // Yaw
      if (!autoHeading) {
        controls['yaw'] += value * maxYaw * 100; // Multiply by 100 for faster turning - I have no idea how this works
      } else {
        headingReference += value * headingIncrement;
        headingReference = headingReference % maxYaw;
        controls['yaw'] = headingReference;
      }
      break;

    // RIGHT BUTTONS X,Y,A,B | RESET BIAS, AUTODEPTH/AUTOHEIGHT
    case 'Y': // Reset all bias
      Object.keys(bias).forEach(v => (bias[v] = 0.0));
      ['surge', 'sway', 'heave'].forEach(v => (controls[v] = 0.0));
      break;
    case 'X': // Used in combination with bias button to reset axis bias
      break;
    case 'A': // Toggle autodepth
      autoDepth = !autoDepth;
      controls['autodepth'] = autoDepth;
      break;
    case 'B': // Toggle autoheading
      autoHeading = !autoHeading;
      controls['autoheading'] = autoHeading;
      break;

    // BIAS BUTTONS | INCREASE/DECREASE BIAS
    case 'DPadRight': // positive sway bias
      setBias('sway', true, controls);
      break;
    case 'DPadLeft': // negative sway bias
      setBias('sway', false, controls);
      break;
    case 'DPadUp': // positive surge bias
      setBias('surge', true, controls);
      break;
    case 'DPadDown': // negative surge bias
      setBias('surge', false, controls);
      break;
    case 'RB': // positive heave bias (down)
      if (!autoDepth) {
        setBias('heave', true, controls);
      }
      break;
    case 'LB': // negative heave bias (up)
      if (!autoDepth) {
        setBias('heave', false, controls);
      }
      break;
  }
  global.toROV = controls;
  global.bias = bias;
}

// Helper function for checking bias-buttons for combination with X and setting biases.
function setBias(type, positive, controls) {
  // Reset axis if X is held down
  if (buttonDown === 'X') {
    bias[type] = 0.0;
    return;
  }
  // Increase bias if it isn't maxed out
  if (positive) {
    bias[type] += bias[type] < maxThruster ? biasIncrease : 0.0;
  } else {
    bias[type] -= bias[type] > -maxThruster ? biasIncrease : 0.0;
  }
  controls[type] = bias[type];
}

//Helper function for making sure thrusting force does not exceed maximum
function fixMaxThruster(type, controls) {
  let force = controls[type];
  if (force > maxThruster) {
    force = maxThruster;
  } else if (force < -maxThruster) {
    force = -maxThruster;
  }
  controls[type] = force;
}

module.exports = { handleClick, setUpOrDown };