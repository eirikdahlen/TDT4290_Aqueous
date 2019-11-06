// Function called from IPC.js when xbox-buttons are changed - maps buttons
// Constants
const maxThruster = 400;
const biasIncrease = 2;
const biasIncreaseTimer = 20;
const maxYaw = 2 * Math.PI;
const nfIncrease = 0.1;
const nfMax = 20;

// Bias values
let bias = {
  surge: 0.0,
  sway: 0.0,
  heave: 0.0,
};

// Variables for bias buttons held down
const biasButtons = ['DPadRight', 'DPadLeft', 'DPadUp', 'DPadDown', 'RB', 'LB'];
const hasBiasButton = obj => {
  return biasButtons.indexOf(obj.button) >= 0;
};
let biasButtonsDown = [];

// Auto settings
let autoDepth = false;
let depthReference = 0.0; // Depth in meters
let depthIncrement = 0.05; // Meters
let autoHeading = false;
let headingReference = 0.0; // Radians
let headingIncrement = 0.05; // Radians

// X is a combination-button, therefore it must be stored if it is pressed
let xDown = false;
const hasXButton = obj => {
  return obj.button === 'X';
};

//ROV control values - used to update global.toROV
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
  biasButtonsDown.forEach(biasButton => {
    handleButton(biasButton);
  });
}, biasIncreaseTimer);

// Converts from button (buttonname) and value (how much pressed) to values for the ROV
function handleClick(activeButtons) {
  // Init values
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

  // Set biasButtons and x-down
  xDown = activeButtons.some(hasXButton);
  biasButtonsDown = [];

  // Loop through every button down and set bias buttons down and handle button clicks
  activeButtons.forEach(obj => {
    if (hasBiasButton(obj)) {
      biasButtonsDown.push(obj);
    }
    handleButton(obj);
  });

  // Updates global values which is sent to the ROV
  global.toROV = controls;
  global.bias = bias;
}

// Maps a button to the correct mode-switch
function handleButton({ button, value }) {
  const { currentMode } = global.mode;
  if (currentMode === 0) {
    handleManual({ button, value });
  } else if (currentMode === 1) {
    handleDP({ button, value });
  } else if (currentMode === 2) {
    handleNF({ button, value });
  } else {
    console.log(
      `Invalid mode ${currentMode} - Button ${button} not registered. Switches to manual mode.`,
    );
    switchToMode(0);
  }
}

// Handles manual mode controls
function handleManual({ button, value }) {
  switch (button) {
    // LEFT STICK + TRIGGERS | SURGE, HEAVE, SWAY
    case 'LeftStickY': // Forward+/Backward-
      controls['surge'] += value * maxThruster;
      fixMaxThruster('surge');
      break;
    case 'LeftStickX': // Right+/Left-
      controls['sway'] += value * maxThruster;
      fixMaxThruster('sway');
      break;
    case 'LeftTrigger': // Up
      if (!autoDepth) {
        controls['heave'] += value * -maxThruster;
        fixMaxThruster('heave');
      } else {
        depthReference -= value * depthIncrement;
        if (depthReference < 0) {
          depthReference = 0;
        }
        controls['heave'] = depthReference;
      }
      break;
    case 'RightTrigger': // Down
      if (!autoDepth) {
        controls['heave'] += value * maxThruster;
        fixMaxThruster('heave');
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

    // RIGHT BUTTONS X,Y,A,B | RESET BIAS, AUTODEPTH/AUTOHEADING
    case 'Y': // Reset all bias'
      resetAllBias();
      break;
    case 'X': // Used in combination with bias buttons
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
    case 'DPadRight': // + sway bias
      setBias('sway', true);
      break;
    case 'DPadLeft': // - sway bias
      setBias('sway', false);
      break;
    case 'DPadUp': // + surge bias
      setBias('surge', true);
      break;
    case 'DPadDown': // - surge bias
      setBias('surge', false);
      break;
    case 'RB': // + heave bias (down)
      if (!autoDepth) {
        setBias('heave', true);
      }
      break;
    case 'LB': // - heave bias (up)
      if (!autoDepth) {
        setBias('heave', false);
      }
      break;

    // BACK AND START BUTTONS | SWITCH MODE and reset bias
    case 'Back': // turn NF on if available
      if (global.mode.nfAvailable) {
        switchToMode(2);
      }
      break;
    case 'Start': // turn DP on if available
      if (global.mode.dpAvailable) {
        switchToMode(1);
        setDPToCurrentPosition();
      }
      break;
  }
}

function handleNF({ button, value }) {
  switch (button) {
    case 'LeftTrigger': // - distance
      setNfParameters('distance', false);
      break;
    case 'RightTrigger': // + distance
      setNfParameters('distance', true);
      break;

    // RIGHT BUTTONS X,Y,A,B | RESET BIAS, AUTODEPTH/AUTOHEIGHT
    case 'Y': //Resets distance, velocity and depth, if in NetFollowing mode
      global.netfollowing.distance = 0;
      global.netfollowing.velocity = 0;
      global.netfollowing.depth = 0;
      break;

    // SET NF PARAMETERS
    case 'DPadUp': //Depth (-)
      setNfParameters('depth', false);
      break;
    case 'DPadDown': //Depth (+)
      setNfParameters('depth', true);
      break;
    case 'RB': //Velocity (+)
      setNfParameters('velocity', true);
      break;
    case 'LB': //Velocity (-)
      setNfParameters('velocity', false);
      break;

    // BACK AND START BUTTONS |
    // NETFOLLOWING (NF) AND DYNAMIC POSITIONING (DP)
    case 'Back': // sets to manual
      switchToMode(0);
      break;
    case 'LS': // combo with X - sets to manual
      if (xDown) {
        switchToMode(0);
      }
      break;
  }
}

function handleDP({ button, value }) {
  switch (button) {
    // BACK AND START BUTTONS | TURN ON MANUAL MODE
    case 'Start': // turn on manual mode
      switchToMode(0);
      break;
    case 'LS': // combo with X - turn on manual mode
      if (xDown) {
        switchToMode(0);
      }
  }
}

function resetAllBias() {
  Object.keys(bias).forEach(v => (bias[v] = 0.0));
  ['surge', 'sway'].forEach(v => (controls[v] = 0.0));
  controls['heave'] = autoDepth ? depthReference : 0.0;
}

// Helper function for checking bias-buttons for combination with X and setting biases.
function setBias(type, positive) {
  if (global.mode.currentMode == 0) {
    // Reset axis if X is held down
    if (xDown) {
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
function fixMaxThruster(type) {
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
  if (xDown) {
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

//Sets global mode to modeNumber and resets all bias
// 0: Manual  1: DP   2: NF
function switchToMode(modeNumber) {
  global.mode.currentMode = modeNumber;
  resetAllBias();
}

// Sets global DP to current position (fromROV)
function setDPToCurrentPosition() {
  Object.keys(global.dynamicpositioning).forEach(attribute => {
    global.dynamicpositioning[attribute] = global.fromROV[attribute];
  });
}

module.exports = { handleClick, handleButton };
