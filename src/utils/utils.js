// Takes in a value and makes sure it is in the interval [min, max]
export const normalize = (value, min, max) => {
  value = Math.min(value, max);
  value = Math.max(value, min);
  return value;
};

// Convert from degrees to radians
export const degreesToRadians = degrees => {
  const maxRads = 2 * Math.PI;
  let radians = (Number(degrees) * (Math.PI / 180)) % maxRads;
  while (radians < 0) {
    radians += maxRads;
  }
  return radians;
};

export const radiansToDegrees = radians => {
  let degrees = (Number(radians) * (180 / Math.PI)) % 360;
  while (degrees < 0) {
    degrees += 360;
  }
  return degrees;
};

// Handles rounding numbers and converting from boolean to numbers - used in Values.jsx and MessageGroup.jsx
export const fixValue = value => {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  try {
    return Math.abs(value) >= 100 ? value.toFixed(1) : value.toFixed(2);
  } catch (error) {
    return value;
  }
};

// Copies object and leaves out properties speciefied in exceptProperties-array - used in Values.jsx
export const copyObjectExcept = (obj, exceptProperties) => {
  let copy = {};
  Object.keys(obj).forEach(key => {
    if (!exceptProperties.includes(key)) {
      copy[key] = obj[key];
    }
  });
  return copy;
};

// Rounds numbers by how big it is
export const roundNumber = number => {
  if (!number) {
    return 0.0;
  }
  const absNum = Math.abs(number);
  if (absNum >= 100) {
    return number.toFixed(0);
  } else {
    return number.toFixed(1);
  }
};

export default {
  normalize,
  degreesToRadians,
  radiansToDegrees,
  fixValue,
  roundNumber,
};
