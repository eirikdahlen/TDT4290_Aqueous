// Function for clamping a value between a minimum and maximum value
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Function for converting radians to degrees
function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Function for converting degrees to radians
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Function for converting any degree value to a value between 0 and 360
function wrapDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}

// Function for mapping a value from one range of numbers to another
function mapRange(old_value, old_min, old_max, new_min, new_max) {
  return (
    ((old_value - old_min) * (new_max - new_min)) / (old_max - old_min) +
    new_min
  );
}

/*
context:        the context belonging to the canvas we want to draw on
initialWidth:   the initial width of the canvas
initialHeight:  the initial height of the canvas
widthOrHeight:  give either window.innerWidth or window.innerHeight
sizeMin:        minimum width/height to use when scaling
sizeMax:        maximum width/height to use when scaling
factorMin:       set the minimum scaling factor to use
factorMax:       set the maximum scaling factor to use
*/
function scaleWidget(
  context,
  initialWidth,
  initialHeight,
  widthOrHeight,
  sizeMin,
  sizeMax,
  factorMin,
  factorMax,
) {
  // Reset scaling
  context.setTransform(1, 0, 0, 1, 0, 0);

  // Calculate the scaling factor based on the window width
  var factor = mapRange(widthOrHeight, sizeMin, sizeMax, factorMin, factorMax);
  factor = clamp(factor, factorMin, factorMax);

  // Resize the canvas itself
  context.canvas.width = initialWidth * factor;
  context.canvas.height = initialHeight * factor;

  // Resize everything drawn on the canvas
  context.scale(factor, factor);

  return factor;
}

export {
  clamp,
  radiansToDegrees,
  degreesToRadians,
  wrapDegrees,
  mapRange,
  scaleWidget,
};
