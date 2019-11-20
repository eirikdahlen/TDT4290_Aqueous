// Function called from IPC.js when xbox-buttons are changed - maps buttons
// Constants
const maxThruster = 200;
const biasIncrease = 2;
const biasIncreaseTimer = 20;
const maxYaw = 2 * Math.PI;
const nfIncrease = 0.1;
const nfLimits = {
  velocity: [-3, 3],
  distance: [0, 3],
  depth: [0, 200],
};
const dpIncrease = 0.05;
const dpLimits = {
  north: [-200, 200],
  east: [-200, 200],
  down: [0, 200],
  yaw: [-maxYaw, maxYaw],
};

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
let headingIncrement = 0.01; // Radians

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
    if (global.mode.currentMode === global.mode.manual)
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
  const { currentMode, manual, dp, nf } = global.mode;
  if (currentMode === manual) {
    handleManual({ button, value });
  } else if (currentMode === dp) {
    handleDP({ button, value });
  } else if (currentMode === nf) {
    handleNF({ button, value });
  } else {
    console.log(`Invalid mode ${currentMode}. Switches to manual mode.`);
    switchToMode('manual');
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
    case 'Y': // Reset all bias
      sendVibrationRequest(true);
      resetAllBias();
      break;
    case 'X': // Used in combination with bias buttons
      break;
    case 'A': // Toggle autodepth
      sendVibrationRequest(true);
      autoDepth = !autoDepth;
      controls['autodepth'] = autoDepth;
      depthReference = global.fromROV.down;
      controls['heave'] = autoDepth ? depthReference : 0.0;
      break;
    case 'B': // Toggle autoheading
      sendVibrationRequest(true);
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
      switchToMode('nf');
      break;
    case 'Start': // turn DP on if available
      switchToMode('dp');
      break;
  }
}

// Handles NF mode controls
function handleNF({ button }) {
  switch (button) {
    case 'DPadLeft': // - distance
      setNfParameters('distance', false);
      break;
    case 'DPadRight': // + distance
      setNfParameters('distance', true);
      break;

    // RIGHT BUTTONS X,Y,A,B | RESET BIAS, AUTODEPTH/AUTOHEIGHT
    case 'Y': //Resets distance, velocity and depth, if in NetFollowing mode
      sendVibrationRequest(true);
      global.netfollowing.distance = 0;
      global.netfollowing.velocity = 0;
      global.netfollowing.depth = 0;
      break;

    // SET NF PARAMETERS
    case 'DPadUp': //Velocity (+)
      setNfParameters('velocity', true);
      break;
    case 'DPadDown': //Velocity (-)
      setNfParameters('velocity', false);
      break;
    case 'RB': //Depth (+)
      setNfParameters('depth', true);
      break;
    case 'LB': //Depth (-)
      setNfParameters('depth', false);
      break;

    // BACK AND START BUTTONS | TURN ON MANUAL MODE
    // Sets to manual if any of the mode buttons are clicked
    case 'Back':
      switchToMode('manual');
      break;
    case 'Start':
      switchToMode('dp');
      break;
  }
}

// Handles DP mode controls
function handleDP({ button, value }) {
  switch (button) {
    // BACK AND START BUTTONS | TURN ON MANUAL MODE
    // Sets to manual if any of the mode buttons are clicked
    case 'Back':
      switchToMode('nf');
      break;
    case 'Start':
      switchToMode('manual');
      break;

    // Depth
    case 'RB':
      setDPParameters('down', true);
      break;
    case 'LB':
      setDPParameters('down', false);
      break;

    // North
    case 'DPadUp':
      setDPParameters('north', true);
      break;
    case 'DPadDown':
      setDPParameters('north', false);
      break;

    // East
    case 'DPadRight':
      setDPParameters('east', true);
      break;
    case 'DPadLeft':
      setDPParameters('east', false);
      break;

    // Yaw
    case 'RightStickX':
      setDPParameters('yaw', true, value);
      break;

    // Use current position
    case 'A':
      setDPToCurrentPosition();
      break;
  }
}

// Resets all bias
function resetAllBias() {
  Object.keys(bias).forEach(v => (bias[v] = 0.0));
  ['surge', 'sway'].forEach(v => (controls[v] = 0.0));
  controls['heave'] = autoDepth ? depthReference : 0.0;
}

// Helper function for checking bias-buttons for combination with X and setting biases.
function setBias(type, positive) {
  if (global.mode.currentMode === global.mode.manual) {
    // Reset axis if X is held down
    if (xDown) {
      sendVibrationRequest(true);
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
  const [min, max] = nfLimits[type];
  let nfValue = global.netfollowing[type];
  if (positive) {
    nfValue += nfIncrease;
    if (nfValue > max) {
      nfValue = max;
    }
  } else {
    nfValue -= nfIncrease;
    if (nfValue < min) {
      nfValue = min;
    }
  }
  global.netfollowing[type] = nfValue;
}

// Setting parameters of global dp variable
function setDPParameters(type, positive, value) {
  const euclideanAttributes = ['north', 'east', 'down'];
  const [min, max] = dpLimits[type];
  let dpValue = global.dynamicpositioning[type];
  if (type !== 'yaw') {
    if (positive) {
      dpValue += dpIncrease;
      if (dpValue > max) {
        dpValue = max;
      }
    } else {
      dpValue -= dpIncrease;
      if (dpValue < min) {
        dpValue = min;
      }
    }
  } else {
    dpValue += value * headingIncrement;
    dpValue = dpValue % maxYaw;
  }
  let newDP = {};
  let currentPosition = {};
  euclideanAttributes.forEach(key => {
    newDP[key] = global.dynamicpositioning[key];
    currentPosition[key] = global.fromROV[key];
  });
  newDP[type] = dpValue;
  const euclideanDistance = Math.sqrt(
    euclideanAttributes.reduce((acc, attribute) => {
      return acc + Math.pow(newDP[attribute] - currentPosition[attribute], 2);
    }, 0.0),
  );
  if (euclideanDistance <= global.mode.maxDPDistance) {
    global.dynamicpositioning[type] = dpValue;
  } else {
    sendVibrationRequest(false);
  }
}

//Sets global mode to modeNumber and resets all bias
// Manual/DP/NF
function switchToMode(modeName) {
  const availabilityKey = modeName + 'Available';
  const available = modeName === 'manual' || global.mode[availabilityKey];
  if (available) {
    resetAllBias();
    global.mode.currentMode = global.mode[modeName];
    sendVibrationRequest(true);
    if (modeName === 'dp') {
      setDPToCurrentPosition();
    } else if (modeName === 'nf') {
      setNFToCurrentDepth();
    }
  } else {
    sendVibrationRequest(false);
  }
}

// Sets global DP to current position (fromROV)
function setDPToCurrentPosition() {
  Object.keys(global.dynamicpositioning).forEach(attribute => {
    global.dynamicpositioning[attribute] = global.fromROV[attribute];
  });
}

function setNFToCurrentDepth() {
  global.netfollowing.depth = global.fromROV.down;
}

// Tells the gamepad to vibrate
function sendVibrationRequest(positive) {
  const { videoWindow } = global;
  try {
    videoWindow.webContents.send('vibrate-gamepad', positive);
  } catch (error) {
    console.log('Video window is closed');
  }
}

module.exports = {
  handleClick,
  handleButton,
  resetAllBias,
  sendVibrationRequest,
};
