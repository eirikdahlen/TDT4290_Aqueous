// Value config
const maxThruster = 400;
const biasIncrease = 20;

// Flags
let autoDepth = false;
let autoHeading = false;

// Biases
const bias = {
  surge: 0.0,
  sway: 0.0,
  heave: 0.0,
};

// Which button is held down
let buttonDown;

// Main function to be run when a click or axis-change has happened
function handleClick({ button, value }) {
  const ROVValues = convertToROVValues({ button, value });
  global.toROV = ROVValues;
}

//Function for setting the variable
function setUpOrDown({ button, down }) {
  buttonDown = down ? button : undefined;
}

/*
Converts from {name, value}
to 
    {'surge': number,
   *  'sway': number,
   *  'heave': number,
   *  'roll': number,
   *  'pitch': number,
   *  'yaw': number,
   *  'autodepth': bool,
   *  'autoheading': bool
   * }
   * */

/*
Mappings
LeftStickY [-1,1]: surge 
LeftStickX [-1,1]: sway
LeftTrigger [0,1]: heave up
RightTrigger [0,1] heave down
*/
function convertToROVValues({ button, value }) {
  let result = {
    surge: 0.0,
    sway: 0.0,
    heave: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
    autodepth: false,
    autoheading: false,
  };
  switch (button) {
    // LEFT STICK
    case 'LeftStickY': // Forward+/Backward-
      result['surge'] = value * maxThruster;
      break;
    case 'LeftStickX': // Right+/Left-
      result['sway'] = value * maxThruster;
      break;
    case 'LeftTrigger': // Up
      result['heave'] = value * -maxThruster;
      break;
    case 'RightTrigger': // Down
      result['heave'] = value * maxThruster;
      break;

    // RIGHT BUTTONS X,Y,A,B
    case 'Y': // Reset all bias
      Object.keys(bias).forEach(v => (bias[v] = 0.0));
      break;
    case 'X': // Used in combination with bias button to reset axis bias
      break;
    case 'A':
      break;
    case 'B':
      break;

    // BIAS BUTTONS - Have to check every case for combination with X
    case 'DPadRight': // positive sway bias
      setBias('sway', value, true);
      break;
    case 'DPadLeft': // negative sway bias
      setBias('sway', value, false);
      break;
    case 'DPadUp': // positive surge bias
      setBias('surge', value, true);
      break;
    case 'DPadDown': // negative surge bias
      setBias('surge', value, false);
      break;
    case 'RB': // positive heave bias (down)
      setBias('heave', value, true);
      break;
    case 'LB': // negative heave bias (up)
      setBias('heave', value, false);
      break;
  }
  console.log(`Pressed ${button} ${value}`);
  console.log(
    `Biases: Surge:${bias.surge} Sway:${bias.sway} Heave:${bias.heave}`,
  );
  return result;
}

// Helper function for checking bias-buttons for combination with X and setting biases.
function setBias(type, value, positive) {
  if (buttonDown === 'X') {
    bias[type] = 0.0;
  } else {
    bias[type] += positive ? value * biasIncrease : value * -biasIncrease;
  }
}

module.exports = { handleClick, setUpOrDown };
