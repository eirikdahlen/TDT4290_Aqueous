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
  context_depth,
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

  context_depth.textBaseline = 'middle';
  context_depth.lineWidth = 1.5;
  context_depth.strokeStyle = color_base;
  context_depth.fillStyle = color_base;

  // Clamp the depth between 0.0 and 200.0;
  depth = clamp(depth, 0.0, 200.0);

  var offset_depth = depth;

  // Clear the canvas every frame (except the rightmost triangle, which is static)
  context_depth.clearRect(0, 0, initialWidth, initialHeight);

  // Text formatting for the depth labels
  context_depth.textAlign = 'right';

  // Add 200 labels (the ROV never descends more than 200 meters)
  for (var i = 0; i < 201; i++) {
    var y_position = (i - offset_depth) * num_space + 250; // Calculate y position of each label

    // Enlarge every 5th label
    if (i % 5 === 0) {
      context_depth.font = '15px Arial';
    } else {
      context_depth.font = '11px Arial';
    }

    // Draw the actual label
    context_depth.fillText(i.toString(), 30, y_position);

    // Draw indicator lines next to every label
    context_depth.beginPath();
    context_depth.moveTo(37, y_position);
    context_depth.lineTo(47, y_position);
    context_depth.stroke();
    context_depth.closePath();
  }

  // Draw autodepth indicator line
  if (isLocked) {
    context_depth.strokeStyle = '#FF0000';
    const y_position_locked = (lockedValue - offset_depth) * num_space + 250;
    context_depth.beginPath();
    context_depth.moveTo(5, y_position_locked);
    context_depth.lineTo(15, y_position_locked);
    context_depth.stroke();
    //context_depth.closePath();
    context_depth.strokeStyle = color_base;
  }

  // Draw number showing the numerical value of the depth
  context_depth.textAlign = 'left';
  context_depth.font = '18px Arial';

  context_depth.fillText(depth.toFixed(2) + ' m', 75, 250);

  // Draw the static indicator triangle
  context_depth.beginPath();
  context_depth.moveTo(50, 250);
  context_depth.lineTo(60, 253);
  context_depth.lineTo(60, 247);
  context_depth.lineTo(50, 250);
  context_depth.stroke();
  context_depth.fill();
}

export { drawDepth, scaleDepth };
