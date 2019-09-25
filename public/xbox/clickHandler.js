let downButtons = [];

// Main function to be run when a click or axis-change has happened
function handleClick(data) {
  const ROVValues = convertToROVValues(data);
  global.toROV = ROVValues;
  console.log(data);
}

//Function for setting the variable
function setUpOrDown(button, down) {
  const btnIndex = downButtons.indexOf(button);
  if (down && btnIndex < 0) {
    downButtons.push(button);
  } else if (!down && btnIndex > 0) {
    downButtons.splice(btnIndex, 1);
  }
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
function convertToROVValues(data) {
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
  const { button, value } = data;
  console.log(data);
  if (button === 'LeftStickY') {
    result['surge'] = value * 400;
  }
  if (button === 'LeftStickX') {
    result['sway'] = value * 400;
  }
  if (button === 'LeftTrigger') {
    result['heave'] = value * 400;
  }
  if (button === 'RightTrigger') {
    result['heave'] = value * 400;
  }
  console.log(result);
  return result;
}

module.exports = { handleClick, setUpOrDown };
