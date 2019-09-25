// Function called from IPC.js when xbox-buttons are changed - maps buttons
let bias = {
  surge: 0.0,
  sway: 0.0,
  heave: 0.0,
};

// Value config
const maxThruster = 400;
const biasIncrease = 20;

// Flags
let autoDepth = false;
let autoHeading = false;

// Yaw config
const PI = 3.14159265359;
const maxYaw = 2 * PI;

// Which button is held down
let buttonDown;

//Function for setting if X is held down
function setUpOrDown({ button, down }) {
  buttonDown = button === 'X' && down ? button : '';
}

// Converst from button (buttonname) and value (how much pressed) to values for the ROV
function handleClick({ button, value }) {
  let controls = {
    surge: bias.surge,
    sway: bias.sway,
    heave: bias.heave,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
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
      controls['heave'] += value * -maxThruster;
      fixMaxThruster('heave', controls);
      break;
    case 'RightTrigger': // Down
      controls['heave'] += value * maxThruster;
      fixMaxThruster('heave', controls);
      break;

    // RIGHT STICK | HEADING/YAW
    case 'RightStickX': // Yaw
      controls['yaw'] += value * maxYaw * 100; // Multiply by 100 for faster turning - I have no idea how this works
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
      setBias('heave', true, controls);
      break;
    case 'LB': // negative heave bias (up)
      setBias('heave', false, controls);
      break;
  }
  console.log(`Pressed ${button} ${value}`);
  global.toROV = controls;
  global.bias = bias;
}

// Helper function for checking bias-buttons for combination with X and setting biases.
function setBias(type, positive, controls) {
  // Reset axis if X is held down
  if (buttonDown === 'X') {
    bias[type] = 0.0;
  }
  // Increase bias if it isn't maxed out
  else if (bias[type] > -maxThruster && bias[type] < maxThruster) {
    bias[type] += positive ? biasIncrease : -biasIncrease;
  }
  controls[type] = bias[type];
}

//Helper function for making sure thrusting force does not exceed maximum
function fixMaxThruster(type, controls) {
  let force = controls[type];
  if (force > maxThruster) {
    force = maxThruster;
  } else if (force < -maxThruster) {
    force = maxThruster;
  }
  controls[type] = force;
}

module.exports = { handleClick, setUpOrDown };
