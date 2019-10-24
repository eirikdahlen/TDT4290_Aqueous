// Function called from IPC.js when xbox-buttons are changed - maps buttons

// Constants
const maxThruster = 400;
const biasIncrease = 10;
const biasIncreaseTimer = 200;
const maxYaw = 2 * Math.PI;
const nfIncrease = 0.1;
const nfMax = 20;

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
let depthIncrement = 0.05; // Meters

let autoHeading = false;
let headingReference = 0.0; // Radians
let headingIncrement = 0.05; // Radians

// Which button is held down
let buttonDown;
let prevButtonDown;

//ROV control values
let controls = {
  surge: 0,
  sway: 0,
  heave: 0,
  roll: 0,
  pitch: 0,
  yaw: 0,
  autodepth: false,
  autoheading: false,
};

//Interval for increasing bias continously
setInterval(() => {
  if (biasButtons[buttonDown] && prevButtonDown !== 'X') {
    handleClick({ button: buttonDown, value: 1 });
  }
}, biasIncreaseTimer);

//Function for setting if X or bias-buttons are held down
function setUpOrDown({ button, down }) {
  if (button === 'X' || biasButtons[button]) {
    prevButtonDown = buttonDown;
    buttonDown = down ? button : '';
  }
}

// Converts from button (buttonname) and value (how much pressed) to values for the ROV
function handleClick({ button, value }) {
  autoHeading = global.toROV.autoheading;
  autoDepth = global.toROV.autodepth;
  if (autoDepth) {
    depthReference = global.toROV.heave;
  }
  if (autoHeading) {
    headingReference = global.toROV.yaw;
  }
  controls = {
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
      if (global.mode.globalMode != 0) {
        setNfParameters('distance', false);
      }
      if (!autoDepth && global.mode.globalMode == 0) {
        controls['heave'] += value * -maxThruster;
        fixMaxThruster('heave', controls);
      } else {
        depthReference -= value * depthIncrement;
        if (depthReference < 0) {
          depthReference = 0;
        }
        controls['heave'] = depthReference;
      }
      break;
    case 'RightTrigger': // Down
      if (global.mode.globalMode != 0) {
        setNfParameters('distance', true);
      }
      if (!autoDepth && global.mode.globalMode == 0) {
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
        controls['yaw'] += value * maxYaw;
      } else {
        headingReference += value * headingIncrement;
        headingReference = headingReference % maxYaw;
        controls['yaw'] = headingReference;
      }
      break;

    // RIGHT BUTTONS X,Y,A,B | RESET BIAS, AUTODEPTH/AUTOHEIGHT
    case 'Y': // Reset all bias'
      if (global.mode.globalMode == 2) {
        //Resets distance, velocity and depth, if in NetFollowing mode
        global.netfollowing.distance = 0;
        global.netfollowing.velocity = 0;
        global.netfollowing.depth = 0;
        break;
      }
      Object.keys(bias).forEach(v => (bias[v] = 0.0));
      ['surge', 'sway'].forEach(v => (controls[v] = 0.0));
      controls['heave'] = autoDepth ? depthReference : 0.0;
      break;
    case 'X': // Used in combination with
      // - bias button to reset axis bias
      // - reset to manual
      break;
    case 'A': // Toggle autodepth
      autoDepth = !autoDepth;
      controls['autodepth'] = autoDepth;
      depthReference = global.fromROV.down;
      controls['heave'] = autoDepth ? depthReference : 0.0;
      break;
    case 'B': // Toggle autoheading
      autoHeading = !autoHeading;
      controls['autoheading'] = autoHeading;
      headingReference = global.fromROV.yaw;
      controls['yaw'] = autoHeading ? headingReference : 0.0;
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
      if (global.mode.globalMode == 2) {
        //Depth (-) if in NF
        setNfParameters('depth', false);
      }
      break;
    case 'DPadDown': // negative surge bias
      setBias('surge', false, controls);
      if (global.mode.globalMode == 2) {
        //Depth (+) if in NF
        setNfParameters('depth', true);
      }
      break;
    case 'RB': // positive heave bias (down)
      if (global.mode.globalMode != 0) {
        setNfParameters('velocity', true); //Velocity (+) if in NF
      }
      if (!autoDepth && global.mode.globalMode == 0) {
        setBias('heave', true, controls);
      }
      break;
    case 'LB': // negative heave bias (up)
      if (global.mode.globalMode != 0) {
        //Velocity (-) if in NF
        setNfParameters('velocity', false);
      }
      if (!autoDepth && global.mode.globalMode == 0) {
        setBias('heave', false, controls);
      }
      break;

    // BACK AND START BUTTONS |
    // NETFOLLOWING (NF) AND DYNAMIC POSITIONING (DP)
    case 'Back': // toggle NF
      global.mode.globalMode =
        global.mode.nfAvailable && global.mode.globalMode == 2 ? 0 : 2;
      break;
    case 'Start': // toggle DP
      global.mode.globalMode = global.mode.globalMode == 1 ? 0 : 1;
      break;
    case 'LS': //turn on manual mode, turn off DP/NF and reset bias
      resetToManual();
      break;
  }
  global.toROV = controls;
  global.bias = bias;
}

// Helper function for checking bias-buttons for combination with X and setting biases.
function setBias(type, positive, controls) {
  if (global.mode.globalMode == 0) {
    // Reset axis if X is held down
    if (buttonDown === 'X') {
      bias[type] = 0.0;
      controls[type] = bias[type];
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

//Helper function for setting parameters in Netfollowing
function setNfParameters(type, positive) {
  if (buttonDown === 'X') {
    global.netfollowing[type] = 0;
    return;
  }
  const typeDistanceOrDepth =
    type == 'distance' || type == 'depth' ? true : false;
  const minus = typeDistanceOrDepth ? 0 : -1;
  if (positive) {
    global.netfollowing[type] +=
      global.netfollowing[type] < nfMax ? nfIncrease : 0.0;
  } else {
    global.netfollowing[type] -=
      global.netfollowing[type] > minus * nfMax ? nfIncrease : 0.0;
  }
}

//Helper function for resetting to manual mode with parameters set to zero.
function resetToManual() {
  if (buttonDown === 'X') {
    global.mode.globalMode = 0;
    Object.keys(bias).forEach(v => (bias[v] = 0.0));
    ['surge', 'sway'].forEach(v => (controls[v] = 0.0));
    controls['heave'] = autoDepth ? depthReference : 0.0;
  }
}

module.exports = { handleClick, setUpOrDown };
