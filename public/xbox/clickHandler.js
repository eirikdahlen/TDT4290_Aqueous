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

// Which button is held down
let buttonDown;

//Function for setting if X is held down
function setUpOrDown({ button, down }) {
  buttonDown = button === 'X' && down ? button : '';
}

// Converst from button (buttonname) and value (how much pressed) to values for the ROV
function handleClick({ button, value }) {
  let result = {
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
    // LEFT STICK
    case 'LeftStickY': // Forward+/Backward-
      result['surge'] += value * maxThruster;
      break;
    case 'LeftStickX': // Right+/Left-
      result['sway'] += value * maxThruster;
      break;
    case 'LeftTrigger': // Up
      result['heave'] += value * -maxThruster;
      break;
    case 'RightTrigger': // Down
      result['heave'] += value * maxThruster;
      break;

    // RIGHT BUTTONS X,Y,A,B
    case 'Y': // Reset all bias
      Object.keys(bias).forEach(v => (bias[v] = 0.0));
      break;
    case 'X': // Used in combination with bias button to reset axis bias
      break;
    case 'A': // Toggle autodepth
      autoDepth = !autoDepth;
      result['autodepth'] = autoDepth;
      break;
    case 'B': // Toggle autoheading
      autoHeading = !autoHeading;
      result['autoheading'] = autoHeading;
      break;

    // BIAS BUTTONS - Have to check every case for combination with X
    case 'DPadRight': // positive sway bias
      setBias('sway', true);
      break;
    case 'DPadLeft': // negative sway bias
      setBias('sway', false);
      break;
    case 'DPadUp': // positive surge bias
      setBias('surge', true);
      break;
    case 'DPadDown': // negative surge bias
      setBias('surge', false);
      break;
    case 'RB': // positive heave bias (down)
      setBias('heave', true);
      break;
    case 'LB': // negative heave bias (up)
      setBias('heave', false);
      break;
  }
  console.log(`Pressed ${button} ${value}`);
  ['surge', 'sway', 'heave'].forEach(v => (result[v] = bias[v]));
  global.toROV = result;
  global.bias = bias;
}

// Helper function for checking bias-buttons for combination with X and setting biases.
function setBias(type, positive) {
  // Reset axis if X is held down
  if (buttonDown === 'X') {
    bias[type] = 0.0;
  }
  // Increase bias if it isn't maxed out
  else if (bias[type] > -maxThruster && bias[type] < maxThruster) {
    bias[type] += positive ? biasIncrease : -biasIncrease;
  }
}

module.exports = { handleClick, setUpOrDown };
