// Function for clamping a value between a minimum and maximum value
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Function for converting radians to degrees
function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Function for mapping a value from one range of numbers to another
function mapRange(old_value, old_min, old_max, new_min, new_max) {
  return (
    ((old_value - old_min) * (new_max - new_min)) / (old_max - old_min) +
    new_min
  );
}

export { clamp, radiansToDegrees, mapRange };
