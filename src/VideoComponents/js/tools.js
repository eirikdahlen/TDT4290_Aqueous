// Function for clamping a value between a minimum and maximum value
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export { clamp };
