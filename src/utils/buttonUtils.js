/*  
Functions used by GamepadWrapper.jsx and KeyboardWrapper.jsx
The components has lists of buttons clicked on the following form

activeButtons = [
    {button: 'X', value: 1.0},
    {button: 'RB', value: 1.0}
]

The following methods are used on this list
*/

// Checks if button (name) is in array
const hasButton = (arr, button) => {
  return arr.some(obj => {
    return obj.button === button;
  });
};

// Removes button (by name) from array
const removeButton = (arr, button) => {
  if (hasButton(arr, button)) {
    arr = arr.filter(obj => {
      return obj.button !== button;
    });
  }
  return arr;
};

// Adds button (name) with value to array
const addButton = (arr, button, value) => {
  if (!hasButton(arr, button)) {
    arr.push({ button, value });
  }
  return arr;
};

module.exports = { addButton, removeButton };
