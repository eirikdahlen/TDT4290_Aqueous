import { clamp, mapRange, scaleWidget, wrapDegrees } from './tools.js';

function wraparound(value, max_value) {
  // Wraparound
  if (value >= max_value) {
    value -= max_value;
  } else if (value <= -100) {
    value += max_value;
  }

  return value;
}

function drawHeading(
  context,
  degrees,
  isLocked,
  lockedValue,
  initialWidth,
  initialHeight,
) {
  var color_base;

  if (isLocked) {
    color_base = '#B0B0B0';
  } else {
    color_base = '#FFFFFF';
  }

  context.textAlign = 'center';
  context.lineWidth = 1.5;
  context.strokeStyle = color_base;
  context.fillStyle = color_base;

  //const width = context.canvas.width;
  const width_half = initialWidth / 2;

  const degree_step = 15; // Number of degrees between each displayed number
  const degree_space = 50; // Spacing between each displayed number

  // Handle negative degrees and degrees larger than 360.
  // Locked value is handled in the parent widget.
  degrees = wrapDegrees(degrees);

  // Convert degrees to pixel offset
  const heading = (degree_space * (120 - degrees)) / degree_step;

  // Clear the screen (except the bottom triangle, which does not move!)
  context.clearRect(0, 0, initialWidth, initialHeight);

  // Optional separator line
  /* context.beginPath();
	context.moveTo(0, 56);
	context.lineTo(800, 56);
	context.stroke(); */

  // Create a label for every degree number to be displayed
  for (var i = 0; i < 360 / degree_step; i++) {
    var text; // Number of degrees, or compass direction
    var x_position; // X position of the current displayed number

    var angle = i * degree_step; // Calculate the actual degree value
    var max_x_position = (360 / degree_step) * degree_space; // Calculate the maximum x-position a label can have

    // Replace numbers with N, E, S, W labels
    switch (angle) {
      case 0:
        text = 'N';
        context.font = '15px Arial';
        break;
      case 90:
        text = 'E';
        context.font = '15px Arial';
        break;
      case 180:
        text = 'S';
        context.font = '15px Arial';
        break;
      case 270:
        text = 'W';
        context.font = '15px Arial';
        break;
      default:
        text = angle.toString();
        context.font = '11px Arial';
        break;
    }

    // Calculate the x position that the label must have
    x_position = i * degree_space + (heading % max_x_position);
    x_position = wraparound(x_position, max_x_position);

    // Draw the actual label
    context.fillText(text, x_position, 35);

    // Draw the indicator line below each label
    context.beginPath();
    context.moveTo(x_position, 43);
    context.lineTo(x_position, 53);
    context.stroke();
  }

  // Draw autoheading indicator line
  if (isLocked) {
    context.strokeStyle = '#FF0000';
    let x_position_locked =
      (lockedValue * degree_space) / degree_step + (heading % max_x_position);
    x_position_locked = wraparound(x_position_locked, max_x_position);
    context.beginPath();
    context.moveTo(x_position_locked, 10);
    context.lineTo(x_position_locked, 20);
    context.stroke();
    context.strokeStyle = color_base;
  }

  // Draw number showing the numerical value of the heading
  context.font = '18px Arial';
  context.fillText(degrees.toFixed(0) + '\xB0', width_half, 100);

  // Draw a triangle indicating the heading
  context.beginPath();
  context.moveTo(width_half, 58);
  context.lineTo(width_half + 3, 68);
  context.lineTo(width_half - 3, 68);
  context.lineTo(width_half, 58);
  context.stroke();
  context.fill();
}

function scaleHeading(context, initialWidth, initialHeight) {
  // Scale widget according to window width
  const factor = scaleWidget(
    context,
    initialWidth,
    initialHeight,
    window.innerWidth,
    1000,
    1500,
    0.7,
    1,
  );

  const lockWidgetHeading = document.getElementById('LockWidgetHeading');

  // Scale the positioning of the corresponding lock widget
  lockWidgetHeading.style.top = 150 * factor + 'px';

  // Add a margin when the widget scales down, for correct positioning
  var sizeLockMargin = mapRange(window.innerWidth, 1000, 1500, 10, 0);
  sizeLockMargin = clamp(sizeLockMargin, 0, 20);
  lockWidgetHeading.style.marginTop = sizeLockMargin + 'px';

  // Scale the font size of the label
  var sizeLockLabel = mapRange(window.innerWidth, 1000, 1500, 12, 16);
  sizeLockLabel = clamp(sizeLockLabel, 12, 16);
  lockWidgetHeading.style.fontSize = sizeLockLabel + 'px';

  // Scale the lock icon
  var sizeLockImg = mapRange(window.innerWidth, 1000, 1500, 12, 17);
  sizeLockImg = clamp(sizeLockImg, 12, 17);
  lockWidgetHeading.getElementsByTagName('img')[0].style.width =
    sizeLockImg + 'px';
}

export default drawHeading;
export { scaleHeading };
