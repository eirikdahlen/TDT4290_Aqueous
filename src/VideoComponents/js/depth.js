import { clamp, scaleWidget } from './tools.js';

const num_space = 50; // Spacing between the numerical labels

function scaleDepth(context, initialWidth, initialHeight) {
  scaleWidget(
    context,
    initialWidth,
    initialHeight,
    window.innerWidth,
    1000,
    1500,
    0.7,
    1,
  );
}

function drawDepth(
  context,
  depth,
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

  context.textBaseline = 'middle';
  context.lineWidth = 1.5;
  context.strokeStyle = color_base;
  context.fillStyle = color_base;

  // Clamp the depth between 0.0 and 200.0;
  depth = clamp(depth, 0.0, 200.0);

  var offset_depth = depth;

  // Clear the canvas every frame (except the rightmost triangle, which is static)
  context.clearRect(0, 0, initialWidth, initialHeight);

  // Text formatting for the depth labels
  context.textAlign = 'right';

  // Add 200 labels (the ROV never descends more than 200 meters)
  for (var i = 0; i < 201; i++) {
    var y_position = (i - offset_depth) * num_space + 250; // Calculate y position of each label

    // Enlarge every 5th label
    if (i % 5 === 0) {
      context.font = '15px Arial';
    } else {
      context.font = '11px Arial';
    }

    // Draw the actual label
    context.fillText(i.toString(), 30, y_position);

    // Draw indicator lines next to every label
    context.beginPath();
    context.moveTo(37, y_position);
    context.lineTo(47, y_position);
    context.stroke();
    context.closePath();
  }

  // Draw autodepth indicator line
  if (isLocked) {
    context.strokeStyle = '#FF0000';
    const y_position_locked = (lockedValue - offset_depth) * num_space + 250;
    context.beginPath();
    context.moveTo(5, y_position_locked);
    context.lineTo(15, y_position_locked);
    context.stroke();
    //context.closePath();
    context.strokeStyle = color_base;
  }

  // Draw number showing the numerical value of the depth
  context.textAlign = 'left';
  context.font = '18px Arial';

  context.fillText(depth.toFixed(2) + ' m', 75, 250);

  // Draw the static indicator triangle
  context.beginPath();
  context.moveTo(50, 250);
  context.lineTo(60, 253);
  context.lineTo(60, 247);
  context.lineTo(50, 250);
  context.stroke();
  context.fill();
}

export default drawDepth;
export { scaleDepth };
